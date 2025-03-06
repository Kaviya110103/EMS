package com.employeesystem.emsbackend.DTO;

public class ImageResponse {
    private String imageUrl1;
    private String imageUrl2;
    private Long employeeId;

    // Constructor
    public ImageResponse(String imageUrl1, String imageUrl2, Long employeeId) {
        this.imageUrl1 = imageUrl1;
        this.imageUrl2 = imageUrl2;
        this.employeeId = employeeId;
    }

    // Getters
    public String getImageUrl1() {
        return imageUrl1;
    }

    public String getImageUrl2() {
        return imageUrl2;
    }

    public Long getEmployeeId() {
        return employeeId;
    }
}
