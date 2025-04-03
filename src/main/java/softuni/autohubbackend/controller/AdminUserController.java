package softuni.autohubbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import softuni.autohubbackend.model.user.entity.Role;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.repository.UserRepository;
import softuni.autohubbackend.web.dto.UserManagementDTO;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserManagementDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserManagementDTO> userDTOs = users.stream()
                .map(user -> {
                    UserManagementDTO dto = new UserManagementDTO();
                    dto.setId(user.getId());
                    dto.setUsername(user.getUsername());
                    dto.setFirstName(user.getFirstName());
                    dto.setLastName(user.getLastName());
                    dto.setEmail(user.getEmail());
                    dto.setPhoneNumber(user.getPhoneNumber());
                    dto.setRole(user.getRole());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDTOs);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserManagementDTO> updateUserRole(
            @PathVariable UUID id,
            @RequestBody Map<String, String> roleUpdate) {

        // Extract role from request body
        String roleString = roleUpdate.get("role");
        if (roleString == null) {
            return ResponseEntity.badRequest().build();
        }

        Role role;
        try {
            role = Role.valueOf(roleString);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        // Find user by id
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update role
        user.setRole(role);
        userRepository.save(user);

        // Map to DTO and return
        UserManagementDTO userDTO = new UserManagementDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());

        return ResponseEntity.ok(userDTO);
    }
}