package com.employeesystem.emsbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee; // Adding the relationship with Employee

    @Column(name = "date_in")
    private LocalDate dateIn;

    @Column(name = "time_in")
    private LocalTime timeIn;

    @Column(name = "time_out")
    private LocalTime timeOut;

    @Column(name = "attendance_status")  // New field added
    private String attendanceStatus;

    @Column(name = "day_status")  // New dayStatus field
    
    private String dayStatus;

    // Default constructor
    public Attendance() {}

    // Constructor with employeeId and attendanceStatus
    public Attendance(Employee employee, LocalDate dateIn, LocalTime timeIn, String attendanceStatus, String dayStatus) {
        this.employee = employee;
        this.dateIn = dateIn;
        this.timeIn = timeIn;
        this.attendanceStatus = attendanceStatus;
        this.dayStatus = dayStatus;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getDateIn() {
        return dateIn;
    }

    public void setDateIn(LocalDate dateIn) {
        this.dateIn = dateIn;
    }

    public LocalTime getTimeIn() {
        return timeIn;
    }

    public void setTimeIn(LocalTime timeIn) {
        this.timeIn = timeIn;
    }

    public LocalTime getTimeOut() {
        return timeOut;
    }

    public void setTimeOut(LocalTime timeOut) {
        this.timeOut = timeOut;
    }

    public String getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(String attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public String getDayStatus() {
        return dayStatus;
    }

    public void setDayStatus(String dayStatus) {
        this.dayStatus = dayStatus;
    }

    public Attendance(Long id, Employee employee, LocalDate dateIn, LocalTime timeIn, LocalTime timeOut,
            String attendanceStatus, String dayStatus) {
        this.id = id;
        this.employee = employee;
        this.dateIn = dateIn;
        this.timeIn = timeIn;
        this.timeOut = timeOut;
        this.attendanceStatus = attendanceStatus;
        this.dayStatus = dayStatus;
    }
}
