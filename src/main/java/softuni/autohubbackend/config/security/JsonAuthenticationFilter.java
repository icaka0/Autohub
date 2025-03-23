package softuni.autohubbackend.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import java.io.IOException;
import java.util.Map;

public class JsonAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        // Existing authentication logic...

        // Check if content type is JSON
        if (request.getContentType() != null && request.getContentType().contains("application/json")) {
            try {
                // Parse JSON request body
                Map<String, String> credentials = new ObjectMapper().readValue(request.getInputStream(), Map.class);

                String username = credentials.get("username");
                String password = credentials.get("password");

                System.out.println("Received JSON login request for username: " + username);

                // Create authentication token
                UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
                        username, password);

                setDetails(request, authRequest);

                return this.getAuthenticationManager().authenticate(authRequest);
            } catch (IOException e) {
                throw new AuthenticationServiceException("Failed to parse authentication request body", e);
            }
        }

        // Fall back to form login for non-JSON requests
        return super.attemptAuthentication(request, response);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            jakarta.servlet.FilterChain chain,
                                            Authentication authResult) throws java.io.IOException, jakarta.servlet.ServletException {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authResult);
        SecurityContextHolder.setContext(context);

        // Explicitly save to session
        securityContextRepository.saveContext(context, request, response);

        // Log session ID and authentication
        HttpSession session = request.getSession(true);
        System.out.println("=== AUTHENTICATION SUCCESS ===");
        System.out.println("User: " + authResult.getName());
        System.out.println("Session ID: " + session.getId());
        System.out.println("Authorities: " + authResult.getAuthorities());
        System.out.println("Principal type: " + authResult.getPrincipal().getClass().getName());
        System.out.println("==============================");

        // Get session attributes to check the security context
        System.out.println("Session attribute SPRING_SECURITY_CONTEXT: " +
                session.getAttribute("SPRING_SECURITY_CONTEXT"));

        // Call the success handler properly
        if (getSuccessHandler() != null) {
            try {
                getSuccessHandler().onAuthenticationSuccess(request, response, authResult);
            } catch (Exception e) {
                System.err.println("Error calling success handler: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("No success handler configured");
            response.setStatus(HttpServletResponse.SC_OK);
        }
    }
}
