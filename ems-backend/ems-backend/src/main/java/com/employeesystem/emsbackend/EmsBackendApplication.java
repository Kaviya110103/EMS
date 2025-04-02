package com.employeesystem.emsbackend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.employeesystem.emsbackend.entity") // Specify the package
public class EmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmsBackendApplication.class, args);
		
	}
	
}
///0.end points
///1. http://localhost:8080/api/images/uploadImage1 image1 , employeeId 1
///2. URL: http://localhost:8080/api/images/uploadImage2/{id}/{attendanceId}    image2 , attendanceId 
/// 
/// 


