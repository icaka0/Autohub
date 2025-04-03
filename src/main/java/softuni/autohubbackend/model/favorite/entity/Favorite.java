package softuni.autohubbackend.model.favorite.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "favorites",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "vehicle_ad_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "vehicle_ad_id", nullable = false)
    private VehicleAd vehicleAd;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;
}
