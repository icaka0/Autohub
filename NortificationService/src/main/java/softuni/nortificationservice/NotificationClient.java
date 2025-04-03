package softuni.nortificationservice;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationClient {
    private final String notificationServiceUrl = "http://localhost:8081";
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendPriceChangeNotification(Long userId, Long vehicleAdId,
                                            String vehicleTitle, double oldPrice, double newPrice) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("userId", userId);
            requestBody.put("vehicleAdId", vehicleAdId);
            requestBody.put("vehicleTitle", vehicleTitle);
            requestBody.put("oldPrice", oldPrice);
            requestBody.put("newPrice", newPrice);

            restTemplate.postForObject(
                    notificationServiceUrl + "/api/notifications/price-change",
                    requestBody,
                    Object.class
            );
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}
