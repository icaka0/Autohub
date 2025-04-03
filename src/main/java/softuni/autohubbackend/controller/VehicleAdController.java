package softuni.autohubbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.repository.UserRepository;
import softuni.autohubbackend.web.dto.VehicleAdDTO;
import softuni.autohubbackend.model.vehicleAd.entity.AdStatus;
import softuni.autohubbackend.model.vehicleAd.service.VehicleAdService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import softuni.autohubbackend.web.mapper.DtoMapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicle-ads")
@RequiredArgsConstructor
public class VehicleAdController {

    private final VehicleAdService vehicleAdService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<VehicleAdDTO>> getAllVehicleAds(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @RequestParam(required = false) BigDecimal priceFrom,
            @RequestParam(required = false) BigDecimal priceTo,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmissionType,
            @RequestParam(required = false) String vehicleType) {

        // If no filters are provided, get all active ads
        if (brand == null && model == null && yearFrom == null && yearTo == null
                && priceFrom == null && priceTo == null && fuelType == null
                && transmissionType == null && vehicleType == null) {
            return ResponseEntity.ok(vehicleAdService.getAllActiveVehicleAds());
        }

        // Otherwise, get filtered ads
        List<VehicleAdDTO> filteredAds = vehicleAdService.getFilteredVehicleAds(
                brand, model, yearFrom, yearTo, priceFrom, priceTo,
                fuelType, transmissionType, vehicleType);

        return ResponseEntity.ok(filteredAds);
    }


    @GetMapping("/{id}/edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VehicleAdDTO> getVehicleAdForEdit(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Find user by username
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        try {
            // This will throw AccessDeniedException if user is not the owner
            VehicleAdDTO vehicleAdDTO = vehicleAdService.getVehicleAdForEdit(id, user.getId());
            return ResponseEntity.ok(vehicleAdDTO);
        } catch (AccessDeniedException e) {
            // Let the GlobalExceptionHandler handle this
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleAdDTO> getVehicleAdById(@PathVariable UUID id) {
        // Increment view count
        vehicleAdService.incrementViewCount(id);

        // Get the ad details
        VehicleAdDTO vehicleAdDTO = vehicleAdService.getVehicleAdById(id);
        return ResponseEntity.ok(vehicleAdDTO);
    }

    @GetMapping("/my-ads")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VehicleAdDTO>> getCurrentUserVehicleAds(
            @AuthenticationPrincipal UserDetails userDetails) {

        // Find user by username
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Get all ads by this user
        List<VehicleAdDTO> userAds = vehicleAdService.getUserVehicleAds(user.getId());
        return ResponseEntity.ok(userAds);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VehicleAdDTO> createVehicleAd(
            @Valid @RequestBody VehicleAdDTO vehicleAdDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Find user by username
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Process images
        vehicleAdDTO = DtoMapper.processVehicleAdImages(vehicleAdDTO);

        // Create the ad
        VehicleAdDTO createdAd = vehicleAdService.createVehicleAd(vehicleAdDTO, user.getId());
        return new ResponseEntity<>(createdAd, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VehicleAdDTO> updateVehicleAd(
            @PathVariable UUID id,
            @Valid @RequestBody VehicleAdDTO vehicleAdDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Find user by username
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Process images
        vehicleAdDTO = DtoMapper.processVehicleAdImages(vehicleAdDTO);

        // Update the ad
        VehicleAdDTO updatedAd = vehicleAdService.updateVehicleAd(id, vehicleAdDTO, user.getId());
        return ResponseEntity.ok(updatedAd);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VehicleAdDTO> updateVehicleAdStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> statusUpdate,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Extract status from request body
        String statusString = statusUpdate.get("status");
        if (statusString == null) {
            return ResponseEntity.badRequest().build();
        }

        AdStatus status;
        try {
            status = AdStatus.valueOf(statusString);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        // Find user by username
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Update ad status
        VehicleAdDTO updatedAd = vehicleAdService.updateVehicleAdStatus(id, status, user.getId());
        return ResponseEntity.ok(updatedAd);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteVehicleAd(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Find user by username
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Delete the ad
        vehicleAdService.deleteVehicleAd(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}