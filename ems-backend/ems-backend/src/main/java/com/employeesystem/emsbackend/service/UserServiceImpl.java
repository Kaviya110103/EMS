package com.employeesystem.emsbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.employeesystem.emsbackend.DTO.UserDto;
import com.employeesystem.emsbackend.entity.Role;
import com.employeesystem.emsbackend.entity.User;
import com.employeesystem.emsbackend.repository.RoleRepository;
import com.employeesystem.emsbackend.repository.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void saveUser(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        Role role = roleRepository.findByName("ROLE_ADMIN");
        if (role == null) {
            role = createRole();
        }
        user.setRoles(List.of(role));
        userRepository.save(user);
    }

    private Role createRole() {
        Role role = new Role();
        role.setName("ROLE_ADMIN");
        return roleRepository.save(role);
    }

    @Override
    public List<UserDto> findAllUsers() {
        // Implement fetching all users here if needed
        throw new UnsupportedOperationException("Method not implemented yet");
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }




    
    public User authenticateUser(String username, String password) {
        // Find user by username
        User user = userRepository.findByUsername(username);
        
        // Validate password using BCryptPasswordEncoder
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user; // Authentication successful
        }
        return null; // Authentication failed
    }
    
}
