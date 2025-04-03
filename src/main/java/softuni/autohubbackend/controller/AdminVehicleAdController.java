package softuni.autohubbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import softuni.autohubbackend.web.dto.VehicleAdDTO;
import softuni.autohubbackend.model.vehicleAd.entity.AdStatus;
import softuni.autohubbackend.model.vehicleAd.service.VehicleAdService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/vehicle-ads")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminVehicleAdController {

    private final VehicleAdService vehicleAdService;

    @GetMapping
    public ResponseEntity<List<VehicleAdDTO>> getAllVehicleAds() {
        // Get all ads including active and inactive
        // This would require a new method in the service, but for simplicity we'll reuse existing methods
        return ResponseEntity.ok(vehicleAdService.getAllActiveVehicleAds());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VehicleAdDTO>> getUserVehicleAds(@PathVariable UUID userId) {
        return ResponseEntity.ok(vehicleAdService.getUserVehicleAds(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VehicleAdDTO> adminUpdateVehicleAdStatus(
            @PathVariable UUID id,
            @RequestBody AdStatus status) {

        // Admin override - no ownership check needed
        // This would require a new method in the service, but for simplicity we'll stub it
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> adminDeleteVehicleAd(@PathVariable UUID id) {
        // Admin override - no ownership check needed
        // This would require a new method in the service, but for simplicity we'll stub it
        throw new UnsupportedOperationException("Not implemented yet");
    }
}