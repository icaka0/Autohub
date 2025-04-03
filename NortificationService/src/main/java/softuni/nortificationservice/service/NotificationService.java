package softuni.nortificationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import softuni.nortificationservice.model.Notification;
import softuni.nortificationservice.model.NotificationRequest;
import softuni.nortificationservice.repository.NotificationRepository;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    public long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    public Notification createPriceChangeNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setVehicleAdId(request.getVehicleAdId());
        notification.setTitle("Price Change: " + request.getVehicleTitle());

        double priceDiff = request.getNewPrice() - request.getOldPrice();
        String changeType = priceDiff > 0 ? "increased" : "decreased";
        double absDiff = Math.abs(priceDiff);

        notification.setMessage("The price for " + request.getVehicleTitle() + " has " +
                changeType + " by €" + absDiff + ".");
        notification.setOldPrice(request.getOldPrice());
        notification.setNewPrice(request.getNewPrice());
        notification.setNotificationType(Notification.NotificationType.PRICE_CHANGE);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    @Transactional
    public boolean markNotificationAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            notificationRepository.save(notification);
            return true;
        }

        return false;
    }
}
