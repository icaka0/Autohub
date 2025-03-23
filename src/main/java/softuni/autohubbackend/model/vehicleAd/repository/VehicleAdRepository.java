package softuni.autohubbackend.model.vehicleAd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;

import java.util.UUID;

public interface VehicleAdRepository extends JpaRepository<VehicleAd, UUID> {

}
