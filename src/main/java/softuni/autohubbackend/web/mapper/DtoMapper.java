package softuni.autohubbackend.web.mapper;


import lombok.experimental.UtilityClass;
import softuni.autohubbackend.model.user.entity.Role;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.web.dto.RegisterRequest;
import softuni.autohubbackend.web.dto.VehicleAdDTO;

import java.util.Arrays;

@UtilityClass
public class DtoMapper {
    /**
     * Maps a RegisterRequest DTO to a User entity for registration
     * Note: This doesn't set the ID as it will be generated when saved
     *
     * @param registerRequest the DTO containing registration information
     * @param encodedPassword the password after being encoded by the password encoder
     * @return a User entity ready to be saved
     */
    public User mapRegisterRequestToUser(RegisterRequest registerRequest, String encodedPassword) {
        return User.builder()
                .username(registerRequest.getUsername())
                .password(encodedPassword)
                .email(registerRequest.getEmail())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .phoneNumber(registerRequest.getPhoneNumber()) // Add phone number mapping
                .role(Role.USER) // Default role
                .build();
    }

    /**
     * Processes image URLs in a VehicleAdDTO to ensure they're compatible with database storage
     *
     * @param dto the VehicleAdDTO containing images to process
     * @return the VehicleAdDTO with processed images
     */
    public static VehicleAdDTO processVehicleAdImages(VehicleAdDTO dto) {
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            // Log the number of images
            System.out.println("Processing " + dto.getImageUrls().size() + " images");

            // Enforce maximum 15 images limit
            if (dto.getImageUrls().size() > 15) {
                System.out.println("Warning: Limiting to 15 images from " + dto.getImageUrls().size());
                dto.setImageUrls(dto.getImageUrls().subList(0, 15));
            }

            // Optional: Add size validation if needed
            for (String imageUrl : dto.getImageUrls()) {
                if (imageUrl.length() > 1_000_000) { // If any single image is extremely large
                    System.out.println("Warning: Very large image detected: " + imageUrl.length() + " chars");
                }
            }
        }
        return dto;

    }
}
