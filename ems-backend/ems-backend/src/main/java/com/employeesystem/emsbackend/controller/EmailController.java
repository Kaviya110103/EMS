package com.employeesystem.emsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.employeesystem.emsbackend.entity.EmailDetails;
import com.employeesystem.emsbackend.service.EmailService;

@RestController
@RequestMapping("/api/email")
@CrossOrigin("*") // Allow requests from frontend
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailDetails emailDetails) {
        return emailService.sendEmail(emailDetails);
    }
}
