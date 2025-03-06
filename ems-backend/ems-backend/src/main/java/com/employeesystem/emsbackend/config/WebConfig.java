package com.employeesystem.emsbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Separate CORS mapping for Employee-related endpoints
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/employee/**")  // For Employee-related endpoints
                .allowedOrigins("http://localhost:3000")  // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allowed HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials (if needed)

        // Separate CORS mapping for Leave Permission-related endpoints
        registry.addMapping("/api/leave-permissions/**")  // For Leave Permission-related endpoints
                .allowedOrigins("http://localhost:3000")  // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allowed HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials (if needed)

        registry.addMapping("/api/images/**")  // For Leave Permission-related endpoints
                .allowedOrigins("http://localhost:3000")  // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allowed HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials (if needed)
        registry.addMapping("/api/attendance/**")  // For Leave Permission-related endpoints
                .allowedOrigins("http://localhost:3000")  // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allowed HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials (if needed)
        
    }

    // Configure static resource handler for file uploads
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");  // Path to serve the uploaded files
    }
}



