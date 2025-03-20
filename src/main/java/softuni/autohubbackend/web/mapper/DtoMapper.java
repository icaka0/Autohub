package softuni.autohubbackend.web.mapper;


import lombok.experimental.UtilityClass;
import softuni.autohubbackend.model.user.entity.Role;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.web.dto.RegisterRequest;

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

}
