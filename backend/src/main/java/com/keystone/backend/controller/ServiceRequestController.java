package com.keystone.backend.controller;

import com.keystone.backend.domain.RequestStatus;
import com.keystone.backend.dto.ServiceRequestRequest;
import com.keystone.backend.dto.ServiceRequestResponse;
import com.keystone.backend.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    // CREATE
    @PostMapping
    public ServiceRequestResponse create(
            @RequestBody ServiceRequestRequest request) {

        return serviceRequestService.create(request);
    }

    // GET ALL
    @GetMapping
    public List<ServiceRequestResponse> getAll() {

        return serviceRequestService.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ServiceRequestResponse getById(
            @PathVariable Long id) {

        return serviceRequestService.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ServiceRequestResponse update(
            @PathVariable Long id,
            @RequestBody ServiceRequestRequest request) {

        return serviceRequestService.update(id, request);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public ServiceRequestResponse updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status) {

        return serviceRequestService.updateStatus(id, status);
    }

    // ASSIGN TECHNICIAN
    @PutMapping("/{id}/assign-technician/{technicianId}")
    public ServiceRequestResponse assignTechnician(
            @PathVariable Long id,
            @PathVariable Long technicianId) {

        return serviceRequestService.assignTechnician(id, technicianId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        serviceRequestService.delete(id);

        return "Service Request Deleted Successfully";
    }
}