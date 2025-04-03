package softuni.autohubbackend.model.vehicleAd.service;

import org.springframework.stereotype.Service;
import softuni.autohubbackend.web.dto.VehicleAdDTO;
import softuni.autohubbackend.model.vehicleAd.entity.AdStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface VehicleAdService {

    /**
     * Create a new vehicle ad
     */
    VehicleAdDTO createVehicleAd(VehicleAdDTO vehicleAdDTO, UUID userId);

    /**
     * Update an existing vehicle ad
     */
    VehicleAdDTO updateVehicleAd(UUID adId, VehicleAdDTO vehicleAdDTO, UUID userId);

    /**
     * Get a vehicle ad by ID
     */
    VehicleAdDTO getVehicleAdById(UUID adId);

    /**
     * Get all vehicle ads by user
     */
    List<VehicleAdDTO> getUserVehicleAds(UUID userId);

    /**
     * Get all active vehicle ads
     */
    List<VehicleAdDTO> getAllActiveVehicleAds();

    VehicleAdDTO getVehicleAdForEdit(UUID adId, UUID userId);

    /**
     * Get filtered vehicle ads
     */
    List<VehicleAdDTO> getFilteredVehicleAds(
            String brand,
            String model,
            Integer yearFrom,
            Integer yearTo,
            BigDecimal priceFrom,
            BigDecimal priceTo,
            String fuelType,
            String transmissionType,
            String vehicleType);

    /**
     * Update ad status (active/inactive)
     */
    VehicleAdDTO updateVehicleAdStatus(UUID adId, AdStatus status, UUID userId);

    /**
     * Delete a vehicle ad
     */
    void deleteVehicleAd(UUID adId, UUID userId);

    /**
     * Increment view count for a vehicle ad
     */
    void incrementViewCount(UUID adId);
}