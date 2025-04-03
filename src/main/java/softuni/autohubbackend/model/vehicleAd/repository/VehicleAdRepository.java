package softuni.autohubbackend.model.vehicleAd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.vehicle.entity.FuelType;
import softuni.autohubbackend.model.vehicle.entity.TransmissionType;
import softuni.autohubbackend.model.vehicle.entity.VehicleType;
import softuni.autohubbackend.model.vehicleAd.entity.AdStatus;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleAdRepository extends JpaRepository<VehicleAd, UUID> {

    List<VehicleAd> findBySeller(User seller);

    List<VehicleAd> findByStatus(AdStatus status);

    @Query("SELECT v FROM VehicleAd v WHERE v.status = :status ORDER BY v.createdAt DESC")
    List<VehicleAd> findActiveAdsOrderByCreatedAtDesc(@Param("status") AdStatus status);

    @Query("SELECT v FROM VehicleAd v WHERE " +
            "(:brand IS NULL OR v.vehicle.brand = :brand) AND " +
            "(:model IS NULL OR v.vehicle.model = :model) AND " +
            "(:minYear IS NULL OR v.vehicle.year >= :minYear) AND " +
            "(:maxYear IS NULL OR v.vehicle.year <= :maxYear) AND " +
            "(:minPrice IS NULL OR v.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR v.price <= :maxPrice) AND " +
            "(:fuelType IS NULL OR v.vehicle.fuelType = :fuelType) AND " +
            "(:transmissionType IS NULL OR v.vehicle.transmissionType = :transmissionType) AND " +
            "(:vehicleType IS NULL OR v.vehicle.vehicleType = :vehicleType) AND " +
            "v.status = 'ACTIVE'")
    List<VehicleAd> findByFilters(
            @Param("brand") String brand,
            @Param("model") String model,
            @Param("minYear") Integer minYear,
            @Param("maxYear") Integer maxYear,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("fuelType") FuelType fuelType,
            @Param("transmissionType") TransmissionType transmissionType,
            @Param("vehicleType") VehicleType vehicleType);

    @Query("SELECT COUNT(v) FROM VehicleAd v WHERE v.seller = :seller")
    long countBySeller(@Param("seller") User seller);

    Optional<VehicleAd> findByIdAndSeller(UUID id, User seller);

    List<VehicleAd> findByStatusAndLastUpdatedBefore(AdStatus status, LocalDateTime dateTime);
}