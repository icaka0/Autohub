package softuni.autohubbackend.model.priceHistory.service;

import softuni.autohubbackend.web.dto.PriceHistoryDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface PriceHistoryService {
    /**
     * Record a price change for a vehicle ad
     */
    PriceHistoryDTO recordPriceChange(UUID adId, BigDecimal oldPrice, BigDecimal newPrice);

    /**
     * Get price history for a vehicle ad
     */
    List<PriceHistoryDTO> getPriceHistory(UUID adId);
}