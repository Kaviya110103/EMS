package com.employeesystem.emsbackend.repository;


import com.employeesystem.emsbackend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
   Employee findByFirstNameAndEmail(String firstname,String email);
// Employee findByUsername(String username);

Employee findByUsername(String username);
Employee findByUsernameAndPassword(String username, String password);

}
