package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.UserRole;

public interface IUserRoleRepository extends CrudRepository<UserRole, String> {
    List<UserRole> findAll(); 
    Optional<UserRole> findByRole(String role);
}
