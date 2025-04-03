package softuni.nortificationservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import softuni.nortificationservice.model.Notification;
import softuni.nortificationservice.model.NotificationRequest;
import softuni.nortificationservice.service.NotificationService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * GET endpoint to retrieve all notifications for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET endpoint to retrieve only unread notifications for a user
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<Map<String, Object>> getUnreadNotificationsForUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotificationsForUser(userId);
        long unreadCount = notificationService.getUnreadNotificationCount(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("notifications", notifications);
        response.put("unreadCount", unreadCount);

        return ResponseEntity.ok(response);
    }

    /**
     * POST endpoint to create a new price change notification
     */
    @PostMapping("/price-change")
    public ResponseEntity<Notification> createPriceChangeNotification(@RequestBody NotificationRequest request) {
        Notification notification = notificationService.createPriceChangeNotification(request);
        return new ResponseEntity<>(notification, HttpStatus.CREATED);
    }

    /**
     * PATCH endpoint to mark a notification as read
     */
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(@PathVariable Long notificationId) {
        boolean success = notificationService.markNotificationAsRead(notificationId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);

        if (success) {
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Notification not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
