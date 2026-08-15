package com.keystone.backend.repository;

import com.keystone.backend.domain.RequestStatus;
import com.keystone.backend.domain.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    long countByStatus(RequestStatus status);

}