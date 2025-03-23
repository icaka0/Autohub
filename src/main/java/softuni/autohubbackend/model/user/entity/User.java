package softuni.autohubbackend.model.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import softuni.autohubbackend.model.vehicleAd.entity.VehicleAd;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Builder
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    @Email
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = true)
    private String lastName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    // Relationship with VehicleAd
    // orphanRemoval = true - is used to remove the child entity when it's no longer referenced by the parent entity
    // cascade = true - is used to propagate the EntityManager operations from parent to child entity
    //  Cascade is a way to manage the state of the entities. When you perform an operation on an entity, the same operation will be applied to the associated entities.
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // This ensures the List is initialized properly when using the Builder pattern
    private List<VehicleAd> vehicleAds = new ArrayList<>();
}
