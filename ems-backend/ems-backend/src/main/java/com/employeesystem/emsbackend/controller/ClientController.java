package com.employeesystem.emsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.employeesystem.emsbackend.entity.Image;
import com.employeesystem.emsbackend.entity.Attendance;
import com.employeesystem.emsbackend.entity.Employee;
import com.employeesystem.emsbackend.service.ImageService;
import com.employeesystem.emsbackend.service.AttendanceService;
import com.employeesystem.emsbackend.service.EmployeeService; // Assuming there's a service for Employee
import com.employeesystem.emsbackend.repository.*;
import jakarta.servlet.http.HttpServletRequest;


import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {
    @Autowired
    private ImageService imageService;
     @Autowired
    private AttendanceService attendanceService;
    @Autowired
    private EmployeeService employeeService; // Assuming EmployeeService is available

    @Autowired
    private ImageRepository imageRepository;
    // // Get all images along with employee information (employeeId is implicitly included)
    // @GetMapping("/images")
    // public ResponseEntity<List<ImageResponse>> getAllImages() {
    //     List<Image> images = imageService.getAllImages();
    //     List<ImageResponse> imageResponses = images.stream()
    //             .map(image -> new ImageResponse(
    //                     "http://localhost:8080/displayImage1/" + image.getId(),
    //                     "http://localhost:8080/displayImage2/" + image.getId(),
    //                     image.getEmployee().getId() // Use employee ID instead of action
    //             ))
    //             .collect(Collectors.toList());
    
    //     return ResponseEntity.ok(imageResponses);
    // }

    // Get images by employee ID and today's date



   
    @PostMapping("/uploadImage1")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> uploadImage1(
            @RequestParam("image1") MultipartFile file1,
            @RequestParam("employeeId") Long employeeId,
            @RequestParam("attendanceId") Long attendanceId) throws IOException, SQLException {
        try {
            // Fetch the Employee record
            Employee employee = employeeService.findEmployeeById(employeeId);
            if (employee == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"message\":\"Employee not found for the provided employeeId\"}");
            }
    
            // Fetch the Attendance record
            Attendance attendance = attendanceService.findAttendanceById(attendanceId);
            if (attendance == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"message\":\"Attendance not found for the provided attendanceId\"}");
            }
    
            // Create a new Image record
            Image image = new Image();
            image.setEmployee(employee);
            image.setAttendance(attendance); // Associate the attendance record
            image.setImage(new javax.sql.rowset.serial.SerialBlob(file1.getBytes()));
            image.setUploadDate(LocalDate.now());
    
            // Save the record
            imageService.create(image);
    
            // Return response
            return ResponseEntity.ok("{\"id\":" + image.getId() + ", \"message\":\"Image 1 uploaded successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();  // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\":\"Internal server error: " + e.getMessage() + "\"}");
        }
    }
    
    public class ImageResponse {
        private String imageUrl1;
        private String imageUrl2;
        private Long employeeId;
        private Long attendanceId;  // Optional
        private LocalDate uploadDate;
        private Long imageId;       // Add this field for Image ID
    
        // Constructor
        public ImageResponse(String imageUrl1, String imageUrl2, Long employeeId, Long attendanceId, 
                             LocalDate uploadDate, Long imageId) {
            this.imageUrl1 = imageUrl1;
            this.imageUrl2 = imageUrl2;
            this.employeeId = employeeId;
            this.attendanceId = attendanceId;
            this.uploadDate = uploadDate;
            this.imageId = imageId;  // Set the Image ID
        }
    
    
        public String getImageUrl1() {
            return imageUrl1;
        }
    
        public String getImageUrl2() {
            return imageUrl2;
        }
    
        public Long getEmployeeId() {
            return employeeId;
        }
    
        public Long getAttendanceId() {
            return attendanceId;
        }
    
        public LocalDate getUploadDate() {
            return uploadDate;
        }
        public Long getImageId() {
            return imageId;
        }
        public void setImageId(Long imageId) {
            this.imageId = imageId;
        }
    }
    

    // Helper class to send URLs for image1 and image2 with employeeId
  

   
/////////////images

/////
    
    // Endpoint to get images by employeeId
    
    // Display the first image by ID
   
    @PostMapping("/uploadImage2/{id}")
    @CrossOrigin(origins = "http://localhost:3000") // Allow React app to access this API
    public ResponseEntity<String> uploadImage2(
            @PathVariable("id") Long id,
            @RequestParam("image2") MultipartFile file2) throws IOException, SQLException {
    
        try {
            // Fetch Image record by ID
            Image image = imageService.findImageById(id);
            if (image == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"message\":\"Image not found for the provided ID\"}");
            }
    
            // Update the Image record with the uploaded file
            if (file2 != null && !file2.isEmpty()) {
                image.setImage2(new javax.sql.rowset.serial.SerialBlob(file2.getBytes()));
            }
            image.setUploadDate(LocalDate.now());
    
            // Save the updated Image record
            imageService.update(image);
    
            // Return success response
            return ResponseEntity.ok("{\"id\":" + image.getId() + ", \"message\":\"Image 2 uploaded successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();  // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\":\"Internal server error: " + e.getMessage() + "\"}");
        }
    }
    
//     @PostMapping("/uploadImage2/{id}")
// @CrossOrigin(origins = "http://localhost:3000")
// public String uploadImage2(
//         @PathVariable("id") Long id,
//         @RequestParam(value = "image2", required = false) MultipartFile file2,
//         @RequestParam(value = "employeeId") Long employeeId) throws IOException, SQLException {

//     // Fetch the Image record by ID
//     Image image = imageService.findImageById(id);
//     if (image == null) {
//         return "{\"message\":\"Image not found for the provided ID\"}";
//     }

//     // Fetch the Employee record by employeeId and set it on the image
//     Employee employee = employeeService.findEmployeeById(employeeId);
//     if (employee == null) {
//         return "{\"message\":\"Employee not found for the provided employeeId\"}";
//     }
//     image.setEmployee(employee);

//     // Handle the second image file
//     if (file2 != null) {
//         byte[] bytes2 = file2.getBytes();
//         Blob blob2 = new javax.sql.rowset.serial.SerialBlob(bytes2);
//         image.setImage2(blob2);
//     }

//     // Update the upload date
//     image.setUploadDate(LocalDate.now());

//     // Save the updated Image record
//     imageService.update(image);

//     // Return a success response
//     return "{\"id\":" + image.getId() + ", \"message\":\"Image2 uploaded successfully for Image ID: " + id + "\"}";
// }



// @GetMapping("/employee/{employeeId}")
// public ResponseEntity<List<Image>> getImagesByEmployeeId(@PathVariable Long employeeId) {
//     List<Image> images = imageService.getImagesByEmployeeId(employeeId);

//     if (images.isEmpty()) {
//         return ResponseEntity.notFound().build();
//     }

//     return ResponseEntity.ok(images);
// }

 // Endpoint to get both images (image1 and image2) by employeeId

 @GetMapping("/imagesByEmployeeId/{employeeId}")
 public ResponseEntity<List<ImageResponse>> getImagesByEmployeeId(@PathVariable Long employeeId) {
     List<Image> images = imageService.getImagesByEmployeeId(employeeId);
     if (images.isEmpty()) {
         return ResponseEntity.notFound().build();
     }
     
     List<ImageResponse> imageResponses = images.stream()
             .map(image -> new ImageResponse(
                     "http://localhost:8080/api/images/displayImage1/" + image.getId(),
                     "http://localhost:8080/api/images/displayImage2/" + image.getId(),
                     image.getEmployee().getId(),
                     image.getAttendance() != null ? image.getAttendance().getId() : null, // Attendance ID
                     image.getUploadDate(),
                     image.getId() // Include Image ID
             ))
             .collect(Collectors.toList());
 
     return ResponseEntity.ok(imageResponses);
 }
 
 
 // Response model to include image URLs

 // Display the first image by ID
 @GetMapping(value = "/displayImage1/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
 public ResponseEntity<byte[]> displayImage1(@PathVariable("id") long id) throws IOException, SQLException {
     Image image = imageService.viewById(id);
     if (image != null) {
         byte[] imageBytes = image.getImage().getBytes(1, (int) image.getImage().length());
         return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
     } else {
         return ResponseEntity.notFound().build();
     }
 }

 // Display the second image by ID
 @GetMapping(value = "/displayImage2/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
 public ResponseEntity<byte[]> displayImage2(@PathVariable("id") long id) throws IOException, SQLException {
     Image image = imageService.viewById(id);
     if (image != null) {
         byte[] imageBytes = image.getImage2().getBytes(1, (int) image.getImage2().length());
         return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
     } else {
         return ResponseEntity.notFound().build();
     }
 }

 @GetMapping(value = "/displayImage1ByAttendanceId/{attendanceId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> displayImage1ByAttendanceId(@PathVariable("attendanceId") Long attendanceId) throws IOException, SQLException {
        try {
            Optional<Image> image = imageRepository.findByAttendanceId(attendanceId);
            if (image.isPresent()) {
                byte[] imageBytes = image.get().getImage().getBytes(1, (int) image.get().getImage().length());
                return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping(value = "/displayImage2ByAttendanceId/{attendanceId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> displayImage2ByAttendanceId(@PathVariable("attendanceId") Long attendanceId) throws IOException, SQLException {
        try {
            Optional<Image> image = imageRepository.findByAttendanceId(attendanceId);
            if (image.isPresent()) {
                byte[] imageBytes = image.get().getImage2().getBytes(1, (int) image.get().getImage2().length());
                return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "/displayImagesByAttendanceId/{attendanceId}")
public ResponseEntity<Map<String, Object>> displayImagesByAttendanceId(@PathVariable("attendanceId") Long attendanceId) {
    try {
        Optional<Image> imageOptional = imageRepository.findByAttendanceId(attendanceId);
        
        if (imageOptional.isPresent()) {
            Image image = imageOptional.get();
            Map<String, Object> response = new HashMap<>();
            
            response.put("attendanceId", attendanceId);
            response.put("imageId", image.getId()); // Include Image ID
            
            if (image.getImage() != null) {
                response.put("imageUrl1", "http://localhost:8080/api/images/displayImage1ByAttendanceId/" + attendanceId);
            }
            if (image.getImage2() != null) {
                response.put("imageUrl2", "http://localhost:8080/api/images/displayImage2ByAttendanceId/" + attendanceId);
            }

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "No images found for this attendance ID"));
        }
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Internal server error"));
    }
}

}
