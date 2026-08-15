package com.keystone.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ProfileController {

    @GetMapping("/api/profile")
    public Map<String, Object> profile(Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        response.put("message", "JWT Authentication Working");
        response.put("email", authentication.getName());

        return response;
    }
}