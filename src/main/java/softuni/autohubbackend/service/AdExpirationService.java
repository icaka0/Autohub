package softuni.autohubbackend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import softuni.autohubbackend.model.vehicleAd.entity.AdStatus;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;
import softuni.autohubbackend.model.vehicleAd.repository.VehicleAdRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdExpirationService {

    private static final Logger logger = LoggerFactory.getLogger(AdExpirationService.class);
    private static final long AD_EXPIRATION_MINUTES = 2; // Changed to 2 minutes for faster testing

    private final VehicleAdRepository vehicleAdRepository;

    @Autowired
    public AdExpirationService(VehicleAdRepository vehicleAdRepository) {
        this.vehicleAdRepository = vehicleAdRepository;
    }

    /**
     * Scheduled task to check for expired ads and deactivate them
     * Runs every minute
     */
    @Scheduled(fixedRate = 60000) // Run every minute (60000 ms)
    public void checkAndExpireAds() {
        logger.info("Running ad expiration check...");

        // Calculate the expiration threshold time (current time minus 2 minutes)
        LocalDateTime expirationThreshold = LocalDateTime.now().minusMinutes(AD_EXPIRATION_MINUTES);

        // Find all ACTIVE ads that were published before the threshold
        List<VehicleAd> expiredAds = vehicleAdRepository.findByStatusAndLastUpdatedBefore(
                AdStatus.ACTIVE, expirationThreshold);

        if (!expiredAds.isEmpty()) {
            logger.info("Found {} ads to expire", expiredAds.size());

            // Update status to EXPIRED for all expired ads
            for (VehicleAd ad : expiredAds) {
                ad.setStatus(AdStatus.EXPIRED);
                vehicleAdRepository.save(ad);
                logger.info("Expired ad ID: {}, Title: {}", ad.getId(), ad.getTitle());
            }
        } else {
            logger.info("No ads to expire at this time");
        }
    }
}