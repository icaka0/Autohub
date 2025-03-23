package softuni.autohubbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import softuni.autohubbackend.config.security.AuthenticationMetadata;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/current")
    public Map<String, Object> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("=== Current User Check ===");
        System.out.println("Auth object: " + auth);

        if (auth != null) {
            System.out.println("Auth Name: " + auth.getName());
            System.out.println("Auth Principal type: " + (auth.getPrincipal() != null ? auth.getPrincipal().getClass().getName() : "null"));
            System.out.println("Is Authenticated: " + auth.isAuthenticated());
            System.out.println("Authorities: " + auth.getAuthorities());

            // Check if the principal is our AuthenticationMetadata
            if (auth.getPrincipal() instanceof AuthenticationMetadata) {
                AuthenticationMetadata userDetails = (AuthenticationMetadata) auth.getPrincipal();
                System.out.println("Found AuthenticationMetadata: " + userDetails.getUsername());

                // Look up the full user record
                User user = userRepository.findByUsername(userDetails.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("email", user.getEmail());
                userInfo.put("firstName", user.getFirstName());
                userInfo.put("lastName", user.getLastName());
                userInfo.put("phoneNumber", user.getPhoneNumber());
                userInfo.put("role", user.getRole());

                return userInfo;
            }

            // Try to find by username if principal isn't AuthenticationMetadata
            if (!auth.getName().equals("anonymousUser")) {
                System.out.println("Looking up user by username: " + auth.getName());
                try {
                    User user = userRepository.findByUsername(auth.getName())
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("username", user.getUsername());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("firstName", user.getFirstName());
                    userInfo.put("lastName", user.getLastName());
                    userInfo.put("phoneNumber", user.getPhoneNumber());
                    userInfo.put("role", user.getRole());

                    return userInfo;
                } catch (Exception e) {
                    System.out.println("Error looking up user: " + e.getMessage());
                }
            }
        }

        System.out.println("No authenticated user found");
        return Map.of("authenticated", false);
    }
}