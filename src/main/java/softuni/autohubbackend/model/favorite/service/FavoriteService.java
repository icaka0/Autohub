package softuni.autohubbackend.model.favorite.service;

import softuni.autohubbackend.web.dto.VehicleAdDTO;

import java.util.List;
import java.util.UUID;

public interface FavoriteService {

    void addFavorite(UUID userId, UUID vehicleAdId);

    void removeFavorite(UUID userId, UUID vehicleAdId);

    List<VehicleAdDTO> getUserFavorites(UUID userId);

    boolean isFavorite(UUID userId, UUID vehicleAdId);
}