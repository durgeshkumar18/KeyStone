package com.keystone.backend.service;

import com.keystone.backend.domain.Customer;
import com.keystone.backend.domain.RequestStatus;
import com.keystone.backend.domain.ServiceRequest;
import com.keystone.backend.domain.Technician;
import com.keystone.backend.dto.ServiceRequestRequest;
import com.keystone.backend.dto.ServiceRequestResponse;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.ServiceRequestRepository;
import com.keystone.backend.repository.TechnicianRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

        @Autowired
        private ServiceRequestRepository serviceRequestRepository;

        @Autowired
        private CustomerRepository customerRepository;

        @Autowired
        private TechnicianRepository technicianRepository;

        // CREATE
        public ServiceRequestResponse create(ServiceRequestRequest request) {

                Customer customer = customerRepository.findById(request.getCustomerId())
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                ServiceRequest serviceRequest = new ServiceRequest();

                serviceRequest.setTitle(request.getTitle());
                serviceRequest.setDescription(request.getDescription());
                serviceRequest.setPriority(request.getPriority());
                serviceRequest.setStatus(RequestStatus.OPEN);
                serviceRequest.setCustomer(customer);

                serviceRequestRepository.save(serviceRequest);

                return mapToResponse(serviceRequest);
        }

        // GET ALL
        public List<ServiceRequestResponse> getAll() {

                return serviceRequestRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        // GET BY ID
        public ServiceRequestResponse getById(Long id) {

                ServiceRequest request = serviceRequestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Service Request not found"));

                return mapToResponse(request);
        }

        // UPDATE
        public ServiceRequestResponse update(
                        Long id,
                        ServiceRequestRequest dto) {

                ServiceRequest request = serviceRequestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Service Request not found"));

                Customer customer = customerRepository.findById(dto.getCustomerId())
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                request.setTitle(dto.getTitle());
                request.setDescription(dto.getDescription());
                request.setPriority(dto.getPriority());
                request.setCustomer(customer);

                serviceRequestRepository.save(request);

                return mapToResponse(request);
        }

        // DELETE
        public void delete(Long id) {

                if (!serviceRequestRepository.existsById(id)) {
                        throw new RuntimeException("Service Request not found");
                }

                serviceRequestRepository.deleteById(id);
        }

        // UPDATE STATUS
        public ServiceRequestResponse updateStatus(
                        Long id,
                        RequestStatus status) {

                ServiceRequest request = serviceRequestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Service Request not found"));

                request.setStatus(status);

                serviceRequestRepository.save(request);

                return mapToResponse(request);
        }

        // ASSIGN TECHNICIAN
        public ServiceRequestResponse assignTechnician(
                        Long serviceRequestId,
                        Long technicianId) {

                ServiceRequest request = serviceRequestRepository.findById(serviceRequestId)
                                .orElseThrow(() -> new RuntimeException("Service Request not found"));

                Technician technician = technicianRepository.findById(technicianId)
                                .orElseThrow(() -> new RuntimeException("Technician not found"));

                // Assign technician
                request.setTechnician(technician);

                // Automatically change status
                request.setStatus(RequestStatus.ASSIGNED);

                serviceRequestRepository.save(request);

                return mapToResponse(request);
        }

        // ENTITY -> DTO
        private ServiceRequestResponse mapToResponse(
                        ServiceRequest request) {

                ServiceRequestResponse response = new ServiceRequestResponse();

                response.setId(request.getId());
                response.setTitle(request.getTitle());
                response.setDescription(request.getDescription());

                response.setCustomerId(request.getCustomer().getId());
                response.setCustomerName(request.getCustomer().getFullName());

                response.setPriority(request.getPriority());
                response.setStatus(request.getStatus());

                // Technician details
                if (request.getTechnician() != null) {
                        response.setTechnicianId(
                                        request.getTechnician().getId());

                        response.setTechnicianName(
                                        request.getTechnician().getFullName());
                }

                response.setCreatedAt(request.getCreatedAt());
                response.setUpdatedAt(request.getUpdatedAt());

                return response;
        }
}