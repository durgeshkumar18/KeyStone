package com.keystone.backend.controller;

import com.keystone.backend.dto.WorkOrderRequest;
import com.keystone.backend.dto.WorkOrderResponse;
import com.keystone.backend.service.WorkOrderService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workorders")
public class WorkOrderController {

    @Autowired
    private WorkOrderService workOrderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER', 'TECHNICIAN')")
    public ResponseEntity<List<WorkOrderResponse>> getAllWorkOrders() {

        return ResponseEntity.ok(
                workOrderService.getAllWorkOrders());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER', 'TECHNICIAN')")
    public ResponseEntity<WorkOrderResponse> getWorkOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                workOrderService.getWorkOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<WorkOrderResponse> createWorkOrder(
            @Valid @RequestBody WorkOrderRequest request) {

        return ResponseEntity.ok(
                workOrderService.createWorkOrder(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<WorkOrderResponse> updateWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody WorkOrderRequest request) {

        return ResponseEntity.ok(
                workOrderService.updateWorkOrder(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteWorkOrder(
            @PathVariable Long id) {

        workOrderService.deleteWorkOrder(id);

        return ResponseEntity.ok(
                "Work Order Deleted Successfully");
    }
}