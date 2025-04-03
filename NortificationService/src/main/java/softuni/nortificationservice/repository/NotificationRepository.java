package softuni.nortificationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import softuni.nortificationservice.model.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, boolean isRead);
    long countByUserIdAndIsRead(Long userId, boolean isRead);
}