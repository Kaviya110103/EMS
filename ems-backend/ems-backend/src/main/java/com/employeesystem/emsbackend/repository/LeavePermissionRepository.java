package com.employeesystem.emsbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.employeesystem.emsbackend.entity.LeavePermission;

public interface LeavePermissionRepository extends JpaRepository<LeavePermission, Long> {
    List<LeavePermission> findByEmployeeId(String employeeId);
    @Query("SELECT COUNT(lp) FROM LeavePermission lp WHERE lp.status = 'Pending'")
    long countPendingLeavePermissions();
    List<LeavePermission> findByAttendanceId(Long attendanceId);
    List<LeavePermission> findByAttendance_Employee_IdAndAttendance_Id(Long employeeId, Long attendanceId);
}