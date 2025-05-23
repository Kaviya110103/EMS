package com.employeesystem.emsbackend.entity;

public class EmailDetails {
    private String sender;
    private String receiver;
    private String subject;
    private String message;

    // Default constructor
    public EmailDetails() {}

    // Parameterized constructor
    public EmailDetails(String sender, String receiver, String subject, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.subject = subject;
        this.message = message;
    }

    // Getters and Setters
    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}