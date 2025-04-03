package softuni.autohubbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import softuni.autohubbackend.model.favorite.service.FavoriteService;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.repository.UserRepository;
import softuni.autohubbackend.web.dto.VehicleAdDTO;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<VehicleAdDTO>> getUserFavorites(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<VehicleAdDTO> favorites = favoriteService.getUserFavorites(user.getId());
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/{adId}")
    public ResponseEntity<Void> addFavorite(
            @PathVariable UUID adId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        favoriteService.addFavorite(user.getId(), adId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{adId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable UUID adId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        favoriteService.removeFavorite(user.getId(), adId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{adId}/status")
    public ResponseEntity<Map<String, Boolean>> checkFavoriteStatus(
            @PathVariable UUID adId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        boolean isFavorite = favoriteService.isFavorite(user.getId(), adId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }
}