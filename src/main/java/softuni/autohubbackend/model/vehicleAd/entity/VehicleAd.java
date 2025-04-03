package softuni.autohubbackend.model.vehicleAd.entity;

import jakarta.persistence.*;
import lombok.*;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.vehicle.entity.Vehicle;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vehicle_ads")
@Getter
@Setter // Add this annotation
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleAd {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AdStatus status;

    @ElementCollection
    @CollectionTable(name = "vehicle_ad_images", joinColumns = @JoinColumn(name = "ad_id"))
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private List<String> imageUrls = new ArrayList<>();

    private String location;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;
}