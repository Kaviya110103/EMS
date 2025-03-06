package com.employeesystem.emsbackend.service;

import com.employeesystem.emsbackend.DTO.UserDto;
import com.employeesystem.emsbackend.entity.User;

import java.util.List;

public interface UserService {
    void saveUser(UserDto userDto);

    User findUserByEmail(String email);

    List<UserDto> findAllUsers();

    User authenticateUser(String username, String password);
}
