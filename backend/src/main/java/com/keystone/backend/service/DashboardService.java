package com.keystone.backend.service;

import com.keystone.backend.domain.RequestStatus;
import com.keystone.backend.domain.WorkOrderStatus;
import com.keystone.backend.dto.DashboardResponse;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.ServiceRequestRepository;
import com.keystone.backend.repository.TechnicianRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

        @Autowired
        private CustomerRepository customerRepository;

        @Autowired
        private TechnicianRepository technicianRepository;

        @Autowired
        private ServiceRequestRepository serviceRequestRepository;

        @Autowired
        private WorkOrderRepository workOrderRepository;

        public DashboardResponse getDashboard() {

                DashboardResponse response = new DashboardResponse();

                // Customer Statistics
                response.setTotalCustomers(customerRepository.count());

                // Technician Statistics
                response.setTotalTechnicians(technicianRepository.count());

                // Service Request Statistics
                response.setTotalServiceRequests(serviceRequestRepository.count());

                response.setPendingRequests(
                                serviceRequestRepository.countByStatus(RequestStatus.OPEN));
                response.setCompletedRequests(
                                serviceRequestRepository.countByStatus(RequestStatus.COMPLETED));

                // Work Order Statistics
                response.setTotalWorkOrders(workOrderRepository.count());

                response.setOpenWorkOrders(
                                workOrderRepository.countByStatus(WorkOrderStatus.OPEN));

                response.setClosedWorkOrders(
                                workOrderRepository.countByStatus(WorkOrderStatus.COMPLETED)
                                                + workOrderRepository.countByStatus(WorkOrderStatus.CANCELLED));

                return response;
        }
}