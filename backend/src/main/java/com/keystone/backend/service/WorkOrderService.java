package com.keystone.backend.service;

import com.keystone.backend.domain.Customer;
import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.dto.WorkOrderRequest;
import com.keystone.backend.dto.WorkOrderResponse;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.WorkOrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderService {

        @Autowired
        private WorkOrderRepository workOrderRepository;

        @Autowired
        private CustomerRepository customerRepository;

        // ============================================================
        // GET ALL WORK ORDERS
        // ============================================================
        public List<WorkOrderResponse> getAllWorkOrders() {

                return workOrderRepository.findAll()
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        // ============================================================
        // GET WORK ORDER BY ID
        // ============================================================
        public WorkOrderResponse getWorkOrderById(Long id) {

                WorkOrder workOrder = workOrderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Work Order not found with id: " + id));

                return convertToResponse(workOrder);
        }

        // ============================================================
        // CREATE WORK ORDER
        // ============================================================
        public WorkOrderResponse createWorkOrder(
                        WorkOrderRequest request) {

                Customer customer = customerRepository.findById(
                                request.getCustomerId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Customer not found with id: "
                                                                + request.getCustomerId()));

                WorkOrder workOrder = new WorkOrder();

                workOrder.setTitle(request.getTitle());
                workOrder.setDescription(request.getDescription());
                workOrder.setCustomer(customer);
                workOrder.setPriority(request.getPriority());
                workOrder.setStatus(request.getStatus());
                workOrder.setScheduledDate(request.getScheduledDate());

                // @PrePersist already sets these values,
                // createdAt is managed by the entity and has no public setter.

                WorkOrder saved = workOrderRepository.save(workOrder);

                return convertToResponse(saved);
        }

        // ============================================================
        // UPDATE WORK ORDER
        // ============================================================
        public WorkOrderResponse updateWorkOrder(
                        Long id,
                        WorkOrderRequest request) {

                WorkOrder workOrder = workOrderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Work Order not found with id: " + id));

                Customer customer = customerRepository.findById(
                                request.getCustomerId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Customer not found with id: "
                                                                + request.getCustomerId()));

                workOrder.setTitle(request.getTitle());
                workOrder.setDescription(request.getDescription());
                workOrder.setCustomer(customer);
                workOrder.setPriority(request.getPriority());
                workOrder.setStatus(request.getStatus());
                workOrder.setScheduledDate(request.getScheduledDate());

                // @PreUpdate automatically updates updatedAt
                WorkOrder updated = workOrderRepository.save(workOrder);

                return convertToResponse(updated);
        }

        // ============================================================
        // DELETE WORK ORDER
        // ============================================================
        public void deleteWorkOrder(Long id) {

                WorkOrder workOrder = workOrderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Work Order not found with id: " + id));

                workOrderRepository.delete(workOrder);
        }

        // ============================================================
        // ENTITY -> RESPONSE
        // ============================================================
        private WorkOrderResponse convertToResponse(
                        WorkOrder workOrder) {

                WorkOrderResponse response = new WorkOrderResponse();

                response.setId(workOrder.getId());
                response.setTitle(workOrder.getTitle());
                response.setDescription(workOrder.getDescription());

                if (workOrder.getCustomer() != null) {

                        response.setCustomerId(
                                        workOrder.getCustomer().getId());

                        response.setCustomerName(
                                        workOrder.getCustomer().getFullName());
                }

                response.setPriority(workOrder.getPriority());
                response.setStatus(workOrder.getStatus());
                response.setScheduledDate(workOrder.getScheduledDate());
                response.setCreatedAt(workOrder.getCreatedAt());
                response.setUpdatedAt(workOrder.getUpdatedAt());

                return response;
        }
}