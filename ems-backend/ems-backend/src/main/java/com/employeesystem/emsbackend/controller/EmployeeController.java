package com.employeesystem.emsbackend.controller;

import com.employeesystem.emsbackend.entity.EmailDetails;
import com.employeesystem.emsbackend.entity.Employee;
import com.employeesystem.emsbackend.service.EmailService;
import com.employeesystem.emsbackend.service.EmployeeService;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/api/emp")
@AllArgsConstructor
public class EmployeeController {
    
    private final EmployeeService employeeService;
    
    @Autowired
    private EmailService emailService;

   
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee createdEmployee = employeeService.createEmployee(employee);

        // Send email to the newly created employee
        EmailDetails emailDetails = new EmailDetails();
        emailDetails.setSender("kaviyagvg2023@gmail.com"); // Replace with your email
        emailDetails.setReceiver(employee.getEmail());
        emailDetails.setSubject("Employee Account Credentials - Indra Institute Of Education");

        String message = String.format(
            "Dear %s,\n\n" +
            "Welcome to Indra Institute of Education (IIE)! We are delighted to have you as part of our team and look forward to your valuable contributions.\n\n" +
            "To get started, please find your official login credentials below:\n\n" +
            "Username: %s\n" +
            "Password: %s\n\n" +
            "Please log in using these credentials and update your password upon your first login for security purposes. If you encounter any issues, feel free to reach out to the IT support team at [Support Email/Contact Number].\n\n" +
            "We are excited to embark on this journey with you and wish you success in your role.\n\n" +
            "Best Regards,\n" +
            "[Your Name]\n" +
            "Admin, Indra Institute of Education (IIE)\n" +
            "[Your Contact Information]",
            employee.getFirstName(),
            employee.getUsername(),
            employee.getPassword()
        );

        emailDetails.setMessage(message);

        String emailResponse = emailService.sendEmail(emailDetails);
        System.out.println(emailResponse); // Log the email response for debugging

        return ResponseEntity.ok(createdEmployee);
    }
    @PostMapping("/sendEmail/{id}")
    public ResponseEntity<String> sendEmailToEmployee(@PathVariable("id") Long id, @RequestBody EmailDetails emailDetails) {
        Employee employee = employeeService.findEmployeeById(id);
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
        }

        emailDetails.setSender("kaviyagvg2023@gmail.com"); // Set the sender's email directly in the code
        emailDetails.setReceiver(employee.getEmail());
        String emailResponse = emailService.sendEmail(emailDetails);
        return ResponseEntity.ok(emailResponse);
    }

    @PostMapping("/sendEmailToAll")
    public ResponseEntity<String> sendEmailToAllEmployees(@RequestBody EmailDetails emailDetails) {
        List<Employee> employees = employeeService.getAllEmployee();
        if (employees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No employees found");
        }

        for (Employee employee : employees) {
            emailDetails.setSender("kaviyagvg2023@gmail.com"); // Set the sender's email directly in the code
            emailDetails.setReceiver(employee.getEmail());
            emailService.sendEmail(emailDetails);
        }

        return ResponseEntity.ok("Emails sent successfully to all employees");
    }

    @GetMapping(path = "/{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Employee> findEmployeeById(@PathVariable("id") Long id) {
        Employee employee = employeeService.findEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @GetMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<Employee>> getAllEmployee() {
        List<Employee> employees = employeeService.getAllEmployee();
        return ResponseEntity.ok(employees);
    }

    @PutMapping("{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Employee> updateEmployee(@PathVariable("id") Long id,
                                                   @RequestBody Employee updateEmployee) {
        Employee emp = employeeService.updateEmployee(id, updateEmployee);
        return ResponseEntity.ok(emp);
    }

    @DeleteMapping("{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> deleteById(@PathVariable("id") Long id) {
        employeeService.deleteEmployeeById(id);
        return ResponseEntity.ok("Employee Deleted Successfully");
    }

    @PostMapping("/uploadProfileImage/{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Employee> uploadProfileImage(@PathVariable("id") Long id,
                                                       @RequestParam("file") MultipartFile file) {
        try {
            Employee updatedEmployee = employeeService.uploadProfileImage(id, file);
            
            // Construct full URL for the profile image
            String baseUrl = "http://192.168.1.36:8080"; // Replace with your actual backend IP
            updatedEmployee.setProfileImage(baseUrl + "/" + updatedEmployee.getProfileImage().replace("\\", "/"));
            
            return ResponseEntity.ok(updatedEmployee);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    

    @PostMapping("/authenticate")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:19000", "http://localhost:8081",    "exp://192.168.1.14:8081", "http://192.168.1.5:8080"}) // Allow React Web & React Native
    
    public ResponseEntity<Employee> authenticateEmployee(@RequestBody Employee loginDetails) {
        try {
            Employee employee = employeeService.authenticateEmployee(loginDetails.getUsername(), loginDetails.getPassword());
            if (employee != null) {
                return ResponseEntity.ok(employee);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            // Log the exception and return a 500 status code with the exception message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(null); // You can add more details in the response body if needed.
        }
    }
}
