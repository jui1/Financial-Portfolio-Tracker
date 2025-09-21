package com.portfoliotracker.controller;

import com.portfoliotracker.dto.AuthRequest;
import com.portfoliotracker.dto.AuthResponse;
import com.portfoliotracker.dto.LoginRequest;
import com.portfoliotracker.entity.User;
import com.portfoliotracker.security.JwtTokenProvider;
import com.portfoliotracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest authRequest) {
        try {
            System.out.println("Received registration request: " + authRequest.getUsername() + ", " + authRequest.getEmail());
            
            if (userService.existsByUsername(authRequest.getUsername())) {
                System.out.println("Username already exists: " + authRequest.getUsername());
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Username is already taken!"));
            }
            
            if (userService.existsByEmail(authRequest.getEmail())) {
                System.out.println("Email already exists: " + authRequest.getEmail());
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email is already in use!"));
            }
            
            User user = new User(authRequest.getUsername(), authRequest.getEmail(), authRequest.getPassword());
            userService.createUser(user);
            
            System.out.println("User registered successfully: " + authRequest.getUsername());
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("=== LOGIN REQUEST RECEIVED ===");
        System.out.println("Username: " + (loginRequest != null ? loginRequest.getUsername() : "null"));
        System.out.println("Password length: " + (loginRequest != null && loginRequest.getPassword() != null ? loginRequest.getPassword().length() : "null"));
        
        try {
            if (loginRequest == null) {
                System.out.println("LoginRequest is null");
                return ResponseEntity.badRequest().body(Map.of("message", "Request body is required"));
            }
            
            if (loginRequest.getUsername() == null || loginRequest.getUsername().trim().isEmpty()) {
                System.out.println("Username is null or empty");
                return ResponseEntity.badRequest().body(Map.of("message", "Username is required"));
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                System.out.println("Password is null or empty");
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
            }
            
            System.out.println("Attempting authentication for: " + loginRequest.getUsername());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername().trim(),
                            loginRequest.getPassword()
                    )
            );
            
            System.out.println("Authentication successful for: " + loginRequest.getUsername());
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication.getName());
            
            System.out.println("JWT token generated successfully");
            
            User user = userService.findByUsername(loginRequest.getUsername().trim());
            
            if (user == null) {
                System.out.println("User not found after authentication: " + loginRequest.getUsername());
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "User not found"));
            }
            
            System.out.println("Login successful for user: " + user.getUsername());
            AuthResponse response = new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail());
            System.out.println("Returning AuthResponse with token length: " + jwt.length());
            return ResponseEntity.ok(response);
            
        } catch (org.springframework.security.core.AuthenticationException e) {
            System.out.println("Authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid username or password"));
        } catch (Exception e) {
            System.out.println("Unexpected error during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("createdAt", user.getCreatedAt());
        
        return ResponseEntity.ok(userInfo);
    }
}
