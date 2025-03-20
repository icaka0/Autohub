package softuni.autohubbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public ResponseEntity<?> testEndpoint() {
        System.out.println("=== API /api/test endpoint called ===");
        return ResponseEntity.ok().body(Map.of(
                "message", "API is working!",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
