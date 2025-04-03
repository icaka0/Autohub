package softuni.autohubbackend.model.vehicleAd.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import softuni.autohubbackend.model.priceHistory.service.PriceHistoryService;
import softuni.autohubbackend.web.dto.UserSummaryDTO;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.repository.UserRepository;
import softuni.autohubbackend.web.dto.VehicleDTO;
import softuni.autohubbackend.model.vehicle.entity.FuelType;
import softuni.autohubbackend.model.vehicle.entity.TransmissionType;
import softuni.autohubbackend.model.vehicle.entity.Vehicle;
import softuni.autohubbackend.model.vehicle.entity.VehicleType;
import softuni.autohubbackend.model.vehicle.repository.VehicleRepository;
import softuni.autohubbackend.web.dto.VehicleAdDTO;
import softuni.autohubbackend.model.vehicleAd.entity.AdStatus;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;
import softuni.autohubbackend.model.vehicleAd.repository.VehicleAdRepository;

import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleAdServiceImpl implements VehicleAdService {

    private final VehicleAdRepository vehicleAdRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final PriceHistoryService priceHistoryService;

    @Override
    @Transactional
    public VehicleAdDTO createVehicleAd(VehicleAdDTO vehicleAdDTO, UUID userId) {


        // Optional: Add some logging for debugging
        if (vehicleAdDTO.getImageUrls() != null) {
            System.out.println("Number of images: " + vehicleAdDTO.getImageUrls().size());
        }

        // Find the seller
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));


        Vehicle vehicle = mapToVehicleEntity(vehicleAdDTO.getVehicle());
        vehicle = vehicleRepository.save(vehicle);

        VehicleAd vehicleAd = VehicleAd.builder()
                .vehicle(vehicle)
                .seller(seller)
                .title(vehicleAdDTO.getTitle())
                .description(vehicleAdDTO.getDescription())
                .price(vehicleAdDTO.getPrice())
                .createdAt(LocalDateTime.now())
                .status(AdStatus.ACTIVE)
                .imageUrls(vehicleAdDTO.getImageUrls()) // This will now keep all images
                .location(vehicleAdDTO.getLocation())
                .contactPhone(vehicleAdDTO.getContactPhone())
                .viewCount(0)
                .build();

        vehicleAd = vehicleAdRepository.save(vehicleAd);
        return mapToVehicleAdDTO(vehicleAd);
    }

    @Override
    @Transactional
    public VehicleAdDTO updateVehicleAd(UUID adId, VehicleAdDTO vehicleAdDTO, UUID userId) {
        // Find the ad and check if the user is the owner
        VehicleAd vehicleAd = getVehicleAdWithOwnerCheck(adId, userId);

        // Check if price was changed and store the old price
        BigDecimal oldPrice = vehicleAd.getPrice();
        BigDecimal newPrice = vehicleAdDTO.getPrice();

        // Update vehicle details
        Vehicle vehicle = vehicleAd.getVehicle();
        Vehicle updatedVehicle = mapToVehicleEntity(vehicleAdDTO.getVehicle());
        updatedVehicle.setId(vehicle.getId());
        vehicle = vehicleRepository.save(updatedVehicle);

        // Update ad details
        vehicleAd.setTitle(vehicleAdDTO.getTitle());
        vehicleAd.setDescription(vehicleAdDTO.getDescription());
        vehicleAd.setPrice(newPrice);
        vehicleAd.setUpdatedAt(LocalDateTime.now());
        vehicleAd.setLocation(vehicleAdDTO.getLocation());
        vehicleAd.setContactPhone(vehicleAdDTO.getContactPhone());

        // Fix for the collection update
        vehicleAd.getImageUrls().clear(); // Clear existing images
        if (vehicleAdDTO.getImageUrls() != null) {
            vehicleAd.getImageUrls().addAll(vehicleAdDTO.getImageUrls()); // Add all new images
        }

        // Save the updated ad
        vehicleAd = vehicleAdRepository.save(vehicleAd);

        // Record price change if price was updated
        if (oldPrice.compareTo(newPrice) != 0) {
            priceHistoryService.recordPriceChange(adId, oldPrice, newPrice);
        }

        // Map and return the DTO
        return mapToVehicleAdDTO(vehicleAd);
    }

    @Override
    public VehicleAdDTO getVehicleAdById(UUID adId) {
        VehicleAd vehicleAd = vehicleAdRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle ad not found"));

        return mapToVehicleAdDTO(vehicleAd);
    }

    @Override
    public List<VehicleAdDTO> getUserVehicleAds(UUID userId) {
        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Get all ads by this user
        List<VehicleAd> userAds = vehicleAdRepository.findBySeller(user);

        // Map to DTOs
        return userAds.stream()
                .map(this::mapToVehicleAdDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleAdDTO> getAllActiveVehicleAds() {
        List<VehicleAd> activeAds = vehicleAdRepository.findActiveAdsOrderByCreatedAtDesc(AdStatus.ACTIVE);

        return activeAds.stream()
                .map(this::mapToVehicleAdDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleAdDTO getVehicleAdForEdit(UUID adId, UUID userId) {
        // This will throw AccessDeniedException if user is not the owner
        VehicleAd vehicleAd = getVehicleAdWithOwnerCheck(adId, userId);
        return mapToVehicleAdDTO(vehicleAd);
    }

    @Override
    public List<VehicleAdDTO> getFilteredVehicleAds(
            String brand,
            String model,
            Integer yearFrom,
            Integer yearTo,
            BigDecimal priceFrom,
            BigDecimal priceTo,
            String fuelType,
            String transmissionType,
            String vehicleType) {

        // Parse enum types if provided
        FuelType fuelTypeEnum = fuelType != null ? FuelType.valueOf(fuelType) : null;
        TransmissionType transTypeEnum = transmissionType != null ? TransmissionType.valueOf(transmissionType) : null;
        VehicleType vehicleTypeEnum = vehicleType != null ? VehicleType.valueOf(vehicleType) : null;

        // Get filtered ads
        List<VehicleAd> filteredAds = vehicleAdRepository.findByFilters(
                brand, model, yearFrom, yearTo, priceFrom, priceTo,
                fuelTypeEnum, transTypeEnum, vehicleTypeEnum);

        // Map to DTOs
        return filteredAds.stream()
                .map(this::mapToVehicleAdDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VehicleAdDTO updateVehicleAdStatus(UUID adId, AdStatus status, UUID userId) {
        // Find the ad and check if the user is the owner
        VehicleAd vehicleAd = getVehicleAdWithOwnerCheck(adId, userId);

        // Update status
        vehicleAd.setStatus(status);
        vehicleAd.setUpdatedAt(LocalDateTime.now());

        // Save the updated ad
        vehicleAd = vehicleAdRepository.save(vehicleAd);

        // Map and return the DTO
        return mapToVehicleAdDTO(vehicleAd);
    }

    @Override
    @Transactional
    public void deleteVehicleAd(UUID adId, UUID userId) {
        // Find the ad and check if the user is the owner
        VehicleAd vehicleAd = getVehicleAdWithOwnerCheck(adId, userId);

        // Delete the ad
        vehicleAdRepository.delete(vehicleAd);
    }

    @Override
    @Transactional
    public void incrementViewCount(UUID adId) {
        VehicleAd vehicleAd = vehicleAdRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle ad not found"));

        vehicleAd.setViewCount(vehicleAd.getViewCount() + 1);
        vehicleAdRepository.save(vehicleAd);
    }

    // Helper method to check if a user is the owner of an ad
    private VehicleAd getVehicleAdWithOwnerCheck(UUID adId, UUID userId) {
        VehicleAd vehicleAd = vehicleAdRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle ad not found"));

        if (!vehicleAd.getSeller().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to modify this ad");
        }

        return vehicleAd;
    }

    // Helper method to map Vehicle entity to DTO
    private VehicleDTO mapToVehicleDTO(Vehicle vehicle) {
        return VehicleDTO.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .fuelType(vehicle.getFuelType())
                .transmissionType(vehicle.getTransmissionType())
                .vehicleType(vehicle.getVehicleType())
                .mileage(vehicle.getMileage())
                .horsePower(vehicle.getHorsePower())
                .color(vehicle.getColor())
                .build();
    }

    // Helper method to map Vehicle DTO to entity
    private Vehicle mapToVehicleEntity(VehicleDTO dto) {
        return Vehicle.builder()
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .fuelType(dto.getFuelType())
                .transmissionType(dto.getTransmissionType())
                .vehicleType(dto.getVehicleType())
                .mileage(dto.getMileage())
                .horsePower(dto.getHorsePower())
                .color(dto.getColor())
                .build();
    }

    // Helper method to map User entity to summary DTO
    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        return UserSummaryDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    // Helper method to map VehicleAd entity to DTO
    private VehicleAdDTO mapToVehicleAdDTO(VehicleAd vehicleAd) {
        return VehicleAdDTO.builder()
                .id(vehicleAd.getId())
                .vehicle(mapToVehicleDTO(vehicleAd.getVehicle()))
                .seller(mapToUserSummaryDTO(vehicleAd.getSeller()))
                .title(vehicleAd.getTitle())
                .description(vehicleAd.getDescription())
                .price(vehicleAd.getPrice())
                .createdAt(vehicleAd.getCreatedAt())
                .updatedAt(vehicleAd.getUpdatedAt())
                .status(vehicleAd.getStatus())
                .imageUrls(vehicleAd.getImageUrls())
                .location(vehicleAd.getLocation())
                .contactPhone(vehicleAd.getContactPhone())
                .viewCount(vehicleAd.getViewCount())
                .build();
    }
}