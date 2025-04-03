package softuni.autohubbackend.model.favorite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import softuni.autohubbackend.model.favorite.entity.Favorite;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    List<Favorite> findByUser(User user);

    Optional<Favorite> findByUserAndVehicleAd(User user, VehicleAd vehicleAd);

    boolean existsByUserAndVehicleAd(User user, VehicleAd vehicleAd);

    void deleteByUserAndVehicleAd(User user, VehicleAd vehicleAd);
}
