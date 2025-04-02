package com.employeesystem.emsbackend.service;

import com.employeesystem.emsbackend.entity.Attendance;
import com.employeesystem.emsbackend.entity.Employee;
import com.employeesystem.emsbackend.entity.Image;
import com.employeesystem.emsbackend.repository.AttendanceRepository;
import com.employeesystem.emsbackend.repository.EmployeeRepository;
import com.employeesystem.emsbackend.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;


@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Attendance timeIn(Long employeeId, String attendanceStatus , String location) {
        // Fetch the employee by ID
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        // Create the attendance record using the employee object
        Attendance attendance = new Attendance(employee, currentDate, currentTime, attendanceStatus, attendanceStatus);
        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance timeOut(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        attendance.setTimeOut(LocalTime.now());
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @Override
    public List<Attendance> getAttendanceByStatus(String attendanceStatus) {
        return attendanceRepository.findByAttendanceStatus(attendanceStatus);
    }

    @Override
    public List<Attendance> getAttendanceByEmployeeId(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    @Override
    public Optional<Attendance> getLatestAttendanceByEmployeeId(Long employeeId) {
        return attendanceRepository.findLatestAttendanceByEmployeeId(employeeId);
    }

    @Override
    public LocalTime getLastTimeInByEmployeeId(Long employeeId) {
        Attendance attendance = attendanceRepository.findTopByEmployeeIdOrderByDateInDesc(employeeId);
        return (attendance != null) ? attendance.getTimeIn() : null;
    }

    @Override
    public LocalTime getLastTimeOutByEmployeeId(Long employeeId) {
        Attendance attendance = attendanceRepository.findTopByEmployeeIdOrderByDateInDesc(employeeId);
        return (attendance != null) ? attendance.getTimeOut() : null;
    }

    @Override
    public Attendance markAbsent(Long employeeId) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(employeeId);
        if (optionalEmployee.isEmpty()) {
            throw new IllegalArgumentException("Employee not found with ID: " + employeeId);
        }
    
        Employee employee = optionalEmployee.get();
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDateIn(LocalDate.now());
        attendance.setTimeIn(null); // Set timeIn as null
        attendance.setTimeOut(null); // Set timeOut as null
        attendance.setAttendanceStatus("Absent");
    
        return attendanceRepository.save(attendance);
    }
    
    @Override
    public Attendance findAttendanceById(Long attendanceId) {
        return attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance record not found with ID: " + attendanceId));
    }


    public List<Image> getImagesByEmployeeId(Long employeeId) {
        // Fetch the images by employeeId
        return imageRepository.findByEmployeeId(employeeId);
    }

    @Override
    public Attendance getLastAttendanceByEmployeeId(Long employeeId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getLastAttendanceByEmployeeId'");
    }

 // Method to update the 'dayStatus' for a given attendanceId
 @Override
 public boolean updateDayStatus(Long id, String dayStatus) {
     Attendance attendance = attendanceRepository.findById(id).orElse(null);
     if (attendance != null) {
         attendance.setDayStatus(dayStatus);
         attendanceRepository.save(attendance);
         return true;
     }
     return false;
 }


}
