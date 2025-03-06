package com.employeesystem.emsbackend.service;

import com.employeesystem.emsbackend.entity.Image;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ImageService {
    Optional<Image> getImageByEmployeeIdAndAttendanceId(Long employeeId, Long attendanceId);

    Image create(Image image);
    List<Image> getAllImages();
    Image viewById(long id);
    List<Image> getImagesByEmployeeId(Long employeeId); // Add this method
     List<Image> getImagesByEmployeeAndDate(Long employeeId, LocalDate date);
    Image findImageByEmployeeId(Long employeeId);
    void update(Image image);
    Image findImageById(Long id);
    List<Image> getImagesByEmployeeIdAndAttendanceId(Long employeeId, Long attendanceId);

    boolean updateDayClose(long id, String dayClose);

    List<Image> getImagesByAttendanceId(Long attendanceId);
}
