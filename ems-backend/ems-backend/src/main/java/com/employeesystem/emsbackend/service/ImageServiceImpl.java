package com.employeesystem.emsbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employeesystem.emsbackend.entity.Image;
import com.employeesystem.emsbackend.repository.ImageRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image create(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    @Override
    public Image viewById(long id) {
        return imageRepository.findById(id).orElse(null);
    }

    @Override
    public List<Image> getImagesByEmployeeId(Long employeeId) {
        return imageRepository.findByEmployeeId(employeeId); // Ensure this method exists in the repository
    }

    @Override
    public List<Image> getImagesByEmployeeAndDate(Long employeeId, LocalDate date) {
        return imageRepository.findByEmployeeIdAndUploadDate(employeeId, date); // Ensure this method exists in the repository
    }

    @Override
    public Image findImageByEmployeeId(Long employeeId) {
        // Fetch the first image for the given employee ID (assuming one-to-many relationship)
        Optional<Image> image = imageRepository.findFirstByEmployeeId(employeeId);
        return image.orElse(null);
    }

    @Override
    public void update(Image image) {
        // Save the updated image record (Spring Data JPA handles updates with save())
        if (imageRepository.existsById(image.getId())) {
            imageRepository.save(image);
        } else {
            throw new IllegalArgumentException("Image with ID " + image.getId() + " does not exist.");
        }
    }

    @Override
    public Image findImageById(Long id) {
        return imageRepository.findById(id).orElse(null);
    }

    @Override
    public List<Image> getImagesByEmployeeIdAndAttendanceId(Long employeeId, Long attendanceId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getImagesByEmployeeIdAndAttendanceId'");
    }

    public Optional<Image> getImageByEmployeeIdAndAttendanceId(Long employeeId, Long attendanceId) {
        try {
            return imageRepository.findByEmployeeIdAndAttendanceId(employeeId, attendanceId);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return Optional.empty();
        }
    }

    @Override
    public boolean updateDayClose(long id, String dayClose) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateDayClose'");
    }

    @Override
    public List<Image> getImagesByAttendanceId(Long attendanceId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getImagesByAttendanceId'");
    }
    
  

    // Implement the method to fetch images by employeeId and attendanceId
   
}
