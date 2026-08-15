package com.keystone.backend.service;

import com.keystone.backend.domain.Technician;
import com.keystone.backend.dto.TechnicianRequest;
import com.keystone.backend.dto.TechnicianResponse;
import com.keystone.backend.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TechnicianService {

        @Autowired
        private TechnicianRepository technicianRepository;

        // CREATE
        public TechnicianResponse create(TechnicianRequest request) {

                Technician technician = new Technician();

                technician.setFullName(request.getFullName());
                technician.setEmail(request.getEmail());
                technician.setPhone(request.getPhone());
                technician.setSpecialization(request.getSpecialization());

                technicianRepository.save(technician);

                return mapToResponse(technician);
        }

        // GET ALL
        public List<TechnicianResponse> getAll() {

                return technicianRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        // GET BY ID
        public TechnicianResponse getById(Long id) {

                Technician technician = technicianRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Technician not found"));

                return mapToResponse(technician);
        }

        // UPDATE
        public TechnicianResponse update(Long id, TechnicianRequest request) {

                Technician technician = technicianRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Technician not found"));

                technician.setFullName(request.getFullName());
                technician.setEmail(request.getEmail());
                technician.setPhone(request.getPhone());
                technician.setSpecialization(request.getSpecialization());

                technicianRepository.save(technician);

                return mapToResponse(technician);
        }

        // DELETE
        public void delete(Long id) {

                technicianRepository.deleteById(id);
        }

        // ENTITY -> DTO
        private TechnicianResponse mapToResponse(Technician technician) {

                TechnicianResponse response = new TechnicianResponse();

                response.setId(technician.getId());
                response.setFullName(technician.getFullName());
                response.setEmail(technician.getEmail());
                response.setPhone(technician.getPhone());
                response.setSpecialization(technician.getSpecialization());
                response.setActive(technician.isActive());
                response.setCreatedAt(technician.getCreatedAt());
                response.setUpdatedAt(technician.getUpdatedAt());

                return response;
        }
}