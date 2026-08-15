package com.keystone.backend.dto;

import com.keystone.backend.domain.Priority;
import com.keystone.backend.domain.WorkOrderStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class WorkOrderResponse {

    private Long id;
    private String title;
    private String description;

    private Long customerId;
    private String customerName;

    private Priority priority;
    private WorkOrderStatus status;

    private LocalDate scheduledDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WorkOrderResponse() {
    }

    public WorkOrderResponse(
            Long id,
            String title,
            String description,
            Long customerId,
            String customerName,
            Priority priority,
            WorkOrderStatus status,
            LocalDate scheduledDate,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.customerId = customerId;
        this.customerName = customerName;
        this.priority = priority;
        this.status = status;
        this.scheduledDate = scheduledDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public WorkOrderStatus getStatus() {
        return status;
    }

    public void setStatus(WorkOrderStatus status) {
        this.status = status;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}