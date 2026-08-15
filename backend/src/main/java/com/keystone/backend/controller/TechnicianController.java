package com.keystone.backend.controller;

import com.keystone.backend.dto.TechnicianRequest;
import com.keystone.backend.dto.TechnicianResponse;
import com.keystone.backend.service.TechnicianService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    @Autowired
    private TechnicianService technicianService;

    // CREATE Technician
    @PostMapping
    public TechnicianResponse create(
            @RequestBody TechnicianRequest request) {

        return technicianService.create(request);
    }

    // GET ALL Technicians
    @GetMapping
    public List<TechnicianResponse> getAll() {

        return technicianService.getAll();
    }

    // GET Technician By ID
    @GetMapping("/{id}")
    public TechnicianResponse getById(
            @PathVariable Long id) {

        return technicianService.getById(id);
    }

    // UPDATE Technician
    @PutMapping("/{id}")
    public TechnicianResponse update(
            @PathVariable Long id,
            @RequestBody TechnicianRequest request) {

        return technicianService.update(id, request);
    }

    // DELETE Technician
    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        technicianService.delete(id);

        return "Technician Deleted Successfully";
    }

}