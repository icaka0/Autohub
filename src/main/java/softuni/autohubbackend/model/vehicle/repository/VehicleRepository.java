package softuni.autohubbackend.model.vehicle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import softuni.autohubbackend.model.vehicle.entity.Vehicle;

import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID>{
}
