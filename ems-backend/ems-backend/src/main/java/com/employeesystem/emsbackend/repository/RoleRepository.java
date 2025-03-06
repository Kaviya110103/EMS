package com.employeesystem.emsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employeesystem.emsbackend.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}