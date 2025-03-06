package com.employeesystem.emsbackend.repository;

import com.employeesystem.emsbackend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByAttendanceStatus(String attendanceStatus);

    List<Attendance> findByEmployeeId(Long employeeId);

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId ORDER BY a.timeIn DESC")
    Optional<Attendance> findLatestAttendanceByEmployeeId(Long employeeId);

    Attendance findTopByEmployeeIdOrderByDateInDesc(Long employeeId);
    

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.dateIn = :dateIn")
    Optional<Attendance> findByEmployeeIdAndDateIn(@Param("employeeId") Long employeeId, @Param("dateIn") LocalDate dateIn);


    @Query("SELECT a FROM Attendance a WHERE a.dateIn = :dateIn")
    List<Attendance> findAttendanceByDate(@Param("dateIn") LocalDate dateIn);
}
