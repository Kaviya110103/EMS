package com.employeesystem.emsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.employeesystem.emsbackend.DTO.LeavePermissionDTO;
import com.employeesystem.emsbackend.entity.Attendance;
import com.employeesystem.emsbackend.entity.LeavePermission;
import com.employeesystem.emsbackend.repository.AttendanceRepository;
import com.employeesystem.emsbackend.repository.EmployeeRepository;
import com.employeesystem.emsbackend.repository.LeavePermissionRepository;
import com.employeesystem.emsbackend.service.AttendanceService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")

@RequestMapping("/api/leave-permissions")
public class LeavePermissionController {

    @Autowired
    private LeavePermissionRepository repository;
    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeavePermissionRepository leavePermissionRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

   


    // Create a new leave or permission request
    @PostMapping("/{employeeId}")
    public ResponseEntity<?> createLeavePermission(
            @PathVariable String employeeId,
            @RequestBody LeavePermission leavePermission) {
        try {
            // Set the employeeId in the LeavePermission entity
            leavePermission.setEmployeeId(employeeId);
    
            // Save the leave permission record
            LeavePermission savedLeavePermission = leavePermissionRepository.save(leavePermission);
    
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLeavePermission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving leave permission: " + e.getMessage());
        }
    }
    
    
    @GetMapping("/attendance/{attendanceId}")
    public List<LeavePermission> getLeavePermissionsByAttendanceId(@PathVariable Long attendanceId) {
        return leavePermissionRepository.findByAttendanceId(attendanceId);
    }

    


    // Get all leave/permission requests
    @GetMapping
    public List<LeavePermission> getAllLeavePermissions() {
        return repository.findAll();
    }

    @GetMapping("/api/leave-permissions/pending-count")
    public long getPendingLeavePermissionsCount() {
        return repository.countPendingLeavePermissions();
    }
    // Get leave/permission requests by employeeId
   @GetMapping("/employee/{employeeId}")
public List<LeavePermissionDTO> getLeavePermissionsByEmployeeId(@PathVariable String employeeId) {
    List<LeavePermission> leavePermissions = repository.findByEmployeeId(employeeId);

    // Transform the entity list to a DTO list
    List<LeavePermissionDTO> leavePermissionDTOs = leavePermissions.stream()
            .map(leave -> {
                LeavePermissionDTO dto = new LeavePermissionDTO();
                dto.setId(leave.getId());
                dto.setType(leave.getType());
                dto.setLeaveType(leave.getLeaveType());
                dto.setStartDate(leave.getStartDate());
                dto.setEndDate(leave.getEndDate());
                dto.setReason(leave.getReason());
                dto.setStatus(leave.getStatus());
                dto.setRequestedAt(leave.getRequestedAt());
                return dto;
            })
            .collect(Collectors.toList());

    return leavePermissionDTOs;
}

    // Get a specific leave/permission request by ID
    @GetMapping("/{id}")
    public LeavePermission getLeavePermissionById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    // Update the status of a request
    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/{id}/status")
    public LeavePermission updateStatus(@PathVariable Long id, @RequestParam String status) {
        // Find the LeavePermission by ID
        LeavePermission leavePermission = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("LeavePermission not found with ID: " + id));
        
        // Update the status
        leavePermission.setStatus(status);

        // Save the updated entity back to the database
        return repository.save(leavePermission);
    }
    

    // Delete a request
    @DeleteMapping("/{id}")
    public String deleteLeavePermission(@PathVariable Long id) {
        repository.deleteById(id);
        return "Request deleted with id: " + id;
    }
     // Get leave/permission request by both employeeId and attendanceId
     @GetMapping("/employee/{employeeId}/attendance/{attendanceId}")
     public List<LeavePermission> getLeavePermissionsByEmployeeIdAndAttendanceId(
             @PathVariable Long employeeId,
             @PathVariable Long attendanceId) {
         return leavePermissionRepository.findByAttendance_Employee_IdAndAttendance_Id(employeeId, attendanceId);
     }

       @GetMapping("/api/attendance/today")
    public List<Attendance> getTodayAttendance() {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findAttendanceByDate(today);
    }
}
