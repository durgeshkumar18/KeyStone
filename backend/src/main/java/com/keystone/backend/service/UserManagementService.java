package com.keystone.backend.service;

import com.keystone.backend.domain.Role;
import com.keystone.backend.domain.User;
import com.keystone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    // ADMIN ONLY - Change user role
    public String updateUserRole(Long userId, Role role) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);

        userRepository.save(user);

        return "User role updated successfully to " + role;
    }
}
