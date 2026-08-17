package com.keystone.backend.service;

import com.keystone.backend.domain.Role;
import com.keystone.backend.domain.User;
import com.keystone.backend.dto.RegisterRequest;
import com.keystone.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register User
    public String registerUser(RegisterRequest request) {

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Encrypt password using BCrypt
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        /*
         * TEST ADMIN ACCOUNT
         */
        user.setRole(Role.ADMIN);

        user.setEnabled(true);

        userRepository.save(user);

        return "User Registered Successfully";
    }
}
