package com.employeesystem.emsbackend.service;

import com.employeesystem.emsbackend.entity.Attendance;
import com.employeesystem.emsbackend.entity.Image;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceService {

    Attendance timeIn(Long employeeId, String attendanceStatus);

    Attendance timeOut(Long id);

    List<Attendance> getAllAttendance();

    List<Attendance> getAttendanceByStatus(String attendanceStatus);

    List<Attendance> getAttendanceByEmployeeId(Long employeeId);

    Optional<Attendance> getLatestAttendanceByEmployeeId(Long employeeId);

    LocalTime getLastTimeInByEmployeeId(Long employeeId);

    LocalTime getLastTimeOutByEmployeeId(Long employeeId);

    Attendance markAbsent(Long employeeId);

    Attendance findAttendanceById(Long attendanceId);

    // Method to get images by employeeId and attendanceId
    List<Image> getImagesByEmployeeId(Long employeeId);

    Attendance getLastAttendanceByEmployeeId(Long employeeId);

    boolean updateDayStatus(Long attendanceId, String dayStatus);

}
