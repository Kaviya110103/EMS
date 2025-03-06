package com.employeesystem.emsbackend.service;

import com.employeesystem.emsbackend.entity.Employee;
import com.employeesystem.emsbackend.repository.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
@AllArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee findEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public List<Employee> getAllEmployee() {
        return employeeRepository.findAll();
    }

    public Employee updateEmployee(Long id, Employee updateEmployee) {
        Employee existingEmployee = employeeRepository.findById(id).orElse(null);
        if (existingEmployee != null) {
            existingEmployee.setFirstName(updateEmployee.getFirstName());
            existingEmployee.setLastName(updateEmployee.getLastName());
            existingEmployee.setMobile(updateEmployee.getMobile());
            existingEmployee.setGender(updateEmployee.getGender());
            existingEmployee.setPosition(updateEmployee.getPosition());
            existingEmployee.setBranch(updateEmployee.getBranch());
            existingEmployee.setUsername(updateEmployee.getUsername());
            existingEmployee.setPassword(updateEmployee.getPassword());
            existingEmployee.setDob(updateEmployee.getDob());
            existingEmployee.setEmail(updateEmployee.getEmail());
            existingEmployee.setProfileImage(updateEmployee.getProfileImage());
            existingEmployee.setAddress(updateEmployee.getAddress());
            existingEmployee.setAlternativeMobile(updateEmployee.getAlternativeMobile());
            existingEmployee.setDateOfJoining(updateEmployee.getDateOfJoining());
            existingEmployee.setResetToken(updateEmployee.getResetToken());
            existingEmployee.setSalary(updateEmployee.getSalary());
            existingEmployee.setWeekOff(updateEmployee.getWeekOff());
            return employeeRepository.save(existingEmployee);
        }
        return null;
    }

    public void deleteEmployeeById(Long id) {
        employeeRepository.deleteById(id);
    }

    private final String uploadDir = "uploads/profileImages/"; // Directory to save images

    public Employee uploadProfileImage(Long employeeId, MultipartFile file) throws IOException {
        Employee employee = findEmployeeById(employeeId);

        // Ensure the upload directory exists
        java.nio.file.Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // Save the file to the upload directory
        String fileName = employeeId + "_" + file.getOriginalFilename();
        java.nio.file.Path filePath = path.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Update the employee's profile image field
        employee.setProfileImage(filePath.toString());
        return employeeRepository.save(employee);
    }

    public Employee authenticateEmployee(String username, String password) {
        Employee employee = employeeRepository.findByUsername(username);
        if (employee != null && employee.getPassword().equals(password)) {
            return employee;
        }
        return null;
    }
}