package com.employeesystem.emsbackend.repository;

import com.employeesystem.emsbackend.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByEmployeeId(Long employeeId);


    @Query("SELECT i FROM Image i WHERE i.attendance.id = :attendanceId")
    Optional<Image> findByAttendanceId(@Param("attendanceId") Long attendanceId);
   
    List<Image> findByEmployeeIdAndUploadDate(Long employeeId, LocalDate date);
    Optional<Image> findFirstByEmployeeId(Long employeeId); // Optional, for findImageByEmployeeId
    Optional<Image> findByEmployeeIdAndAttendanceId(Long employeeId, Long attendanceId);
}
