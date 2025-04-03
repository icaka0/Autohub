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


// This controller is used for checking the current user's details.
// It is used to verify the user's authentication status and return the user's details if they are authenticated.
// The controller uses the SecurityContextHolder to get the current Authentication object and extract the user details from it.
// If the user is authenticated, the controller returns the user's details, otherwise it returns a message indicating that no authenticated user was found.
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