package softuni.autohubbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import softuni.autohubbackend.model.priceHistory.service.PriceHistoryService;
import softuni.autohubbackend.web.dto.PriceHistoryDTO;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicle-ads/{adId}/price-history")
@RequiredArgsConstructor
public class PriceHistoryController {

    private final PriceHistoryService priceHistoryService;

    @GetMapping
    public ResponseEntity<List<PriceHistoryDTO>> getPriceHistory(@PathVariable UUID adId) {
        List<PriceHistoryDTO> priceHistory = priceHistoryService.getPriceHistory(adId);
        return ResponseEntity.ok(priceHistory);
    }
}
