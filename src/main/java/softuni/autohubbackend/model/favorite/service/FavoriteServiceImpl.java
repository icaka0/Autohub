package softuni.autohubbackend.model.favorite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import softuni.autohubbackend.model.favorite.entity.Favorite;
import softuni.autohubbackend.model.favorite.repository.FavoriteRepository;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.repository.UserRepository;
import softuni.autohubbackend.model.vehicle.entity.Vehicle;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;
import softuni.autohubbackend.model.vehicleAd.repository.VehicleAdRepository;
import softuni.autohubbackend.web.dto.UserSummaryDTO;
import softuni.autohubbackend.web.dto.VehicleAdDTO;
import softuni.autohubbackend.web.dto.VehicleDTO;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final VehicleAdRepository vehicleAdRepository;

    @Override
    @Transactional
    public void addFavorite(UUID userId, UUID vehicleAdId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        VehicleAd vehicleAd = vehicleAdRepository.findById(vehicleAdId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle ad not found"));

        // Check if already a favorite
        if (favoriteRepository.existsByUserAndVehicleAd(user, vehicleAd)) {
            return; // Already a favorite, no need to add again
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .vehicleAd(vehicleAd)
                .addedAt(LocalDateTime.now())
                .build();

        favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(UUID userId, UUID vehicleAdId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        VehicleAd vehicleAd = vehicleAdRepository.findById(vehicleAdId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle ad not found"));

        favoriteRepository.findByUserAndVehicleAd(user, vehicleAd)
                .ifPresent(favoriteRepository::delete);
    }

    @Override
    public List<VehicleAdDTO> getUserFavorites(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return favoriteRepository.findByUser(user).stream()
                .map(favorite -> mapToVehicleAdDTO(favorite.getVehicleAd()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFavorite(UUID userId, UUID vehicleAdId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        VehicleAd vehicleAd = vehicleAdRepository.findById(vehicleAdId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle ad not found"));

        return favoriteRepository.existsByUserAndVehicleAd(user, vehicleAd);
    }

    // Helper methods for mapping entities to DTOs
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
}