package softuni.autohubbackend.controller;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import softuni.autohubbackend.model.user.entity.User;
import softuni.autohubbackend.model.user.service.UserService;
import softuni.autohubbackend.web.dto.RegisterRequest;

import java.io.IOException;
import java.util.Map;


@RestController
@RequestMapping("/")
public class HomeController {

//    private final UserService userService;
//
//    @Autowired
//    public HomeController(UserService userService) {
//        this.userService = userService;
//    }
//
//    public static final String FRONTEND_URL = "http://localhost:5173";
//
//    @GetMapping(value = "/")
//    public void redirectToHomePage(HttpServletResponse response) throws IOException {
//        response.sendRedirect(FRONTEND_URL);
//
//    }
//
//    @GetMapping("/register")
//    public void redirectToRegisterPage(HttpServletResponse response) throws IOException {
//        response.sendRedirect(FRONTEND_URL + "/register");
//    }
//
//    @GetMapping("/login")
//    public void redirectToLoginPage(HttpServletResponse response) throws IOException {
//        response.sendRedirect(FRONTEND_URL + "/login");
//    }
//
////    @PostMapping("/register")
////    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
////        User registeredUser = userService.registerUser(registerRequest);
////
////        // Return a JSON response (not a redirect)
////        return ResponseEntity.ok().body(Map.of(
////                "message", "Registration successful",
////                "success", true,
////                "username", registeredUser.getUsername()
////
////        ));
////    }



}
