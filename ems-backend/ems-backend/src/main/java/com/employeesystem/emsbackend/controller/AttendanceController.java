package com.employeesystem.emsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.employeesystem.emsbackend.entity.Attendance;
import com.employeesystem.emsbackend.entity.Employee;
import com.employeesystem.emsbackend.repository.AttendanceRepository;
import com.employeesystem.emsbackend.repository.EmployeeRepository;
import com.employeesystem.emsbackend.service.AttendanceService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:19000", "http://localhost:8081",    "exp://192.168.1.14:8081", "http://192.168.1.14:8081"})

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

       private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Time In endpoint (uses employeeId instead of action)
    @PostMapping("/time-in")
    public Attendance timeIn(@RequestBody Map<String, String> payload) {
        Long employeeId = Long.parseLong(payload.get("employeeId"));
        String attendanceStatus = payload.get("attendanceStatus");
        String location = payload.get("location");

        return attendanceService.timeIn(employeeId, attendanceStatus,location); // Save employeeId and attendanceStatus
    }

    // Time Out endpoint
    @PostMapping("/time-out/{id}")
    public Attendance timeOut(@PathVariable Long id) {
        return attendanceService.timeOut(id); // Handle Time Out for the specific attendance record
    }

    // Fetch all attendance records
    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/status")
    public List<Attendance> getAttendanceByStatus(@RequestParam String attendanceStatus) {
        return attendanceService.getAttendanceByStatus(attendanceStatus);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployeeId(@PathVariable Long employeeId) {
        List<Attendance> attendanceList = attendanceService.getAttendanceByEmployeeId(employeeId);
        if (attendanceList.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no records found
        }
        return ResponseEntity.ok(attendanceList); // Return 200 and the list of attendance records
    }

    // Endpoint to get the latest attendance details for an employee
    @GetMapping("/latest/{employeeId}")
    public Optional<Attendance> getLatestAttendance(@PathVariable Long employeeId) {
        return attendanceService.getLatestAttendanceByEmployeeId(employeeId);
    }

    // Fetch timeIn by employeeId
    @GetMapping("/timein/employee/{employeeId}")
    public ResponseEntity<LocalTime> getLastTimeInByEmployeeId(@PathVariable Long employeeId) {
        LocalTime timeIn = attendanceService.getLastTimeInByEmployeeId(employeeId);
        if (timeIn != null) {
            return ResponseEntity.ok(timeIn);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Fetch timeOut by employeeId
    @GetMapping("/timeout/employee/{employeeId}")
    public ResponseEntity<LocalTime> getLastTimeOutByEmployeeId(@PathVariable Long employeeId) {
        LocalTime timeOut = attendanceService.getLastTimeOutByEmployeeId(employeeId);
        if (timeOut != null) {
            return ResponseEntity.ok(timeOut);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/mark-absent")
    public ResponseEntity<Attendance> markAbsent(@RequestParam Long employeeId) {
        Attendance attendance = attendanceService.markAbsent(employeeId);
        return ResponseEntity.ok(attendance);
    }

     @PostMapping("/post-attendance")
    public ResponseEntity<String> createAttendance(
            @RequestParam Long employeeId,
            @RequestParam String timeIn,
            @RequestParam String timeOut
    ) {
        // Check if the employee exists
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employeeId));

        // Parse the time inputs
        LocalTime parsedTimeIn = LocalTime.parse(timeIn);
        LocalTime parsedTimeOut = LocalTime.parse(timeOut);

        // Create a new attendance record
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDateIn(LocalDate.now());
        attendance.setTimeIn(parsedTimeIn);
        attendance.setTimeOut(parsedTimeOut);
        attendance.setAttendanceStatus("Present");

        // Save the record
        attendanceRepository.save(attendance);

        return ResponseEntity.ok("Attendance record created successfully!");
    }

 // payroll status ... number of days calucualte

 @PostMapping("/updateDayStatus/{id}")
 public ResponseEntity<String> updateDayStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
     System.out.println("Received request for ID: " + id);
     System.out.println("Request Body: " + request);
 
     String dayStatus = request.get("dayStatus");
 
     if (dayStatus == null || dayStatus.isEmpty()) {
         return ResponseEntity.status(400).body("Invalid request: dayStatus is required.");
     }
 
     boolean updated = attendanceService.updateDayStatus(id, dayStatus);
 
     if (updated) {
         return ResponseEntity.ok("DayStatus updated successfully.");
     } else {
         return ResponseEntity.status(400).body("Failed to update DayStatus.");
     }
 }
 

 @PostMapping("/check-day-status")
 public ResponseEntity<String> checkDayStatus(
         @RequestParam Long employeeId,
         @RequestParam Long attendanceId) {

     boolean isCompleted = attendanceService.isDayStatusCompleted(employeeId, attendanceId);

     if (isCompleted) {
         return ResponseEntity.ok("Day status is Completed");
     } else {
         return ResponseEntity.ok("Day status is NOT Completed");
     }
 }
 
}
