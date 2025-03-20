package softuni.autohubbackend.model.user.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import softuni.autohubbackend.config.security.AuthenticationMetadata;
import softuni.autohubbackend.model.user.entity.Role;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.repository.UserRepository;
import softuni.autohubbackend.web.dto.RegisterRequest;

@Service
public class UserService implements UserDetailsService {
     private final UserRepository userRepository;
     private final PasswordEncoder passwordEncoder;


     @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(RegisterRequest registerRequest){

         if(registerRequest == null){
                throw new IllegalArgumentException("Registration data cannot be null");
         }
         if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
             throw new IllegalArgumentException("Email already exists");
         }
         String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
         if (!registerRequest.getEmail().matches(emailRegex)) {
            throw new IllegalArgumentException("Invalid email format");
         }
         if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()){
             throw new IllegalArgumentException("User already exists");
         }

         if(!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())){
             throw new IllegalArgumentException("Passwords do not match");
         }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName() != null ? registerRequest.getLastName() : "")
                .phoneNumber(registerRequest.getPhoneNumber()) // Save phone number from request
                .role(Role.USER) // User role by default
                .build();

         return userRepository.save(user);
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
          return new AuthenticationMetadata(user.getId(), user.getUsername(), user.getPassword(), user.getRole());
    }
}
