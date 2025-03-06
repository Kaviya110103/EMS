package com.employeesystem.emsbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "employeess")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "gender")
    private String gender;

    @Column(name = "position")
    private String position;

    @Column(name = "branch")
    private String branch;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "dob")
    private String dob;

    @Column(name = "email_id", nullable = false, unique = true)
    private String email;

    // New field for profile image
    @Column(name = "profile_image")
    private String profileImage; // URL of the uploaded image

    @Column(name = "address")
    private String address;

    @Column(name = "alternative_mobile")
    private String alternativeMobile;

    @Column(name = "date_of_joining")
    private String dateOfJoining;

    // New field for password reset token
    @Column(name = "reset_token")
    private String resetToken;

    // New fields for salary and week off
    @Column(name = "salary")
    private Double salary;

    @Column(name = "week_off")
    private String weekOff;
}