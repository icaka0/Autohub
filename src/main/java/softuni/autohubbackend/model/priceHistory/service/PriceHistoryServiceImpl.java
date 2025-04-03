package softuni.autohubbackend.model.priceHistory.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import softuni.autohubbackend.model.priceHistory.entity.PriceHistory;
import softuni.autohubbackend.model.priceHistory.repository.PriceHistoryRepository;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;
import softuni.autohubbackend.model.vehicleAd.repository.VehicleAdRepository;
import softuni.autohubbackend.web.dto.PriceHistoryDTO;

import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceHistoryServiceImpl implements PriceHistoryService {

    private final PriceHistoryRepository priceHistoryRepository;
    private final VehicleAdRepository vehicleAdRepository;

    @Override
    public PriceHistoryDTO recordPriceChange(UUID adId, BigDecimal oldPrice, BigDecimal newPrice) {
        // Skip recording if prices are the same
        if (oldPrice.compareTo(newPrice) == 0) {
            return null;
        }

        VehicleAd vehicleAd = vehicleAdRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle ad not found"));

        PriceHistory priceHistory = PriceHistory.builder()
                .vehicleAd(vehicleAd)
                .oldPrice(oldPrice)
                .newPrice(newPrice)
                .changedAt(LocalDateTime.now())
                .build();

        priceHistory = priceHistoryRepository.save(priceHistory);
        return mapToPriceHistoryDTO(priceHistory);
    }

    @Override
    public List<PriceHistoryDTO> getPriceHistory(UUID adId) {
        List<PriceHistory> priceHistories = priceHistoryRepository.findByVehicleAdIdOrderByChangedAtDesc(adId);
        return priceHistories.stream()
                .map(this::mapToPriceHistoryDTO)
                .collect(Collectors.toList());
    }

    private PriceHistoryDTO mapToPriceHistoryDTO(PriceHistory priceHistory) {
        return PriceHistoryDTO.builder()
                .id(priceHistory.getId())
                .vehicleAdId(priceHistory.getVehicleAd().getId())
                .oldPrice(priceHistory.getOldPrice())
                .newPrice(priceHistory.getNewPrice())
                .changedAt(priceHistory.getChangedAt())
                .build();
    }
}