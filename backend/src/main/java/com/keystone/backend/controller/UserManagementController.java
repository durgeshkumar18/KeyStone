package com.keystone.backend.controller;

import com.keystone.backend.domain.Role;
import com.keystone.backend.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    // ADMIN ONLY
    @PutMapping("/{id}/role")
    public String updateRole(
            @PathVariable Long id,
            @RequestParam Role role) {

        return userManagementService.updateUserRole(id, role);
    }
}
