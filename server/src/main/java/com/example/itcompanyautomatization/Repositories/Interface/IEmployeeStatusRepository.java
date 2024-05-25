package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.EmployeeStatus;

public interface IEmployeeStatusRepository extends CrudRepository<EmployeeStatus, String> {
    List<EmployeeStatus> findAll();
}