package com.employeesystem.emsbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF for testing purposes
            .authorizeHttpRequests(auth -> auth
                // Allow unauthenticated access to specific endpoints
                .requestMatchers(HttpMethod.POST, "/api/emp/authenticate").permitAll() // Allow this API
                .requestMatchers(HttpMethod.GET, "/api/emp/images").permitAll() // Allow this API
                .requestMatchers(HttpMethod.POST, "/api/attendance/mark-absent").permitAll() // Allow this API
              
                .requestMatchers(
                    "/api/users/save",          // User registration
                    "/api/users/authenticate",  // User authentication
                    "/api/emp/authenticate",    // Employee authentication
                    "/api/emp",                 // Create employee
                    "/api/leave-permissions/**",// Allow access to leave-permissions endpoints
                    "/api/images/**",           // Allow access to image endpoints
                    "/uploads/**",              // Allow access to static uploaded files
                    "/api/emp/images",          // Allow access to images endpoint
                    "/api/emp/images/**",       // Allow access to images endpoint with parameters
                    "/api/emp/**",              // Allow access to all employee endpoints
                    "/api/employees",           // Allow access to employees endpoint
                    "/api/attendance",          // Allow access to attendance endpoint
                    "/api/attendance/**",       // Allow access to all attendance endpoints
                    "/api/attendance/updateDayStatus/{id}",
                    "/api/images/Dayclose/**"
                ).permitAll()
                // Secure all other endpoints
                .anyRequest().permitAll()
            )
            .formLogin(form -> form.disable()); // Disable default form login (for JWT or other custom auth methods)

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Password encoder for secure password hashing
    }
}