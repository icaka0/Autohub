package softuni.autohubbackend.model.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import softuni.autohubbackend.model.user.entity.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
        Optional<User> findByUsername(String username);

        Optional<User> findById(UUID userId);

        Optional<User> findByEmail(String email);
}
