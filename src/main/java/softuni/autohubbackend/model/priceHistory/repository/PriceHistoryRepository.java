package softuni.autohubbackend.model.priceHistory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import softuni.autohubbackend.model.priceHistory.entity.PriceHistory;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;

import java.util.List;
import java.util.UUID;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, UUID> {
    List<PriceHistory> findByVehicleAdOrderByChangedAtDesc(VehicleAd vehicleAd);
    List<PriceHistory> findByVehicleAdIdOrderByChangedAtDesc(UUID vehicleAdId);
}