package softuni.autohubbackend.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfiguration {


    private final CorsConfigurationSource corsConfigurationSource;
    private final UserDetailsService userDetailsService;
    @Autowired
    public SecurityConfiguration(CorsConfigurationSource corsConfigurationSource, UserDetailsService userDetailsService) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.userDetailsService = userDetailsService;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Create custom JSON authentication filter
        JsonAuthenticationFilter authFilter = new JsonAuthenticationFilter();
        authFilter.setAuthenticationManager(authenticationManager(http.getSharedObject(AuthenticationConfiguration.class)));
        authFilter.setFilterProcessesUrl("/login");
        authFilter.setAuthenticationSuccessHandler((request, response, authentication) -> {
            System.out.println("Login successful for user: " + authentication.getName());
            response.setStatus(200);
        });
        authFilter.setAuthenticationFailureHandler((request, response, exception) -> {
            System.out.println("Login failed: " + exception.getMessage());
            exception.printStackTrace();
            response.setStatus(401);
        });

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/", "/register", "/login", "/logout", "/api/auth/**", "/api/user/**", "/browse").permitAll()
                        // Add these two lines to allow GET access to vehicle ads
                        .requestMatchers(HttpMethod.GET, "/api/vehicle-ads").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vehicle-ads/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilter(authFilter)  // Add our custom filter
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
                // Add explicit session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}



