package softuni.autohubbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.service.UserService;
import softuni.autohubbackend.web.dto.RegisterRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        System.out.println("=== API /api/auth/register endpoint called ===");
        System.out.println("Request data: " + registerRequest);

        try {
            User registeredUser = userService.registerUser(registerRequest);

            System.out.println("Registration successful for: " + registeredUser.getUsername());

            return ResponseEntity.ok().body(Map.of(
                    "message", "Registration successful",
                    "success", true,
                    "username", registeredUser.getUsername()
            ));
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

}