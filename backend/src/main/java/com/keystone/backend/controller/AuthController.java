package com.keystone.backend.controller;

import com.keystone.backend.dto.AuthResponse;
import com.keystone.backend.dto.LoginRequest;
import com.keystone.backend.dto.RegisterRequest;
import com.keystone.backend.service.AuthService;
import com.keystone.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        System.out.println("=================================");
        System.out.println("REGISTER REQUEST RECEIVED");
        System.out.println("Full Name: " + request.getFullName());
        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + request.getPassword());
        System.out.println("Role: " + request.getRole());
        System.out.println("=================================");

        return ResponseEntity.ok(
                userService.registerUser(request));
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}