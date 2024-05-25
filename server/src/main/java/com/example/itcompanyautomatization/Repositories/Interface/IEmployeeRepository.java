package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.Employee;
import com.example.itcompanyautomatization.Models.User;

public interface IEmployeeRepository extends CrudRepository<Employee, String> {
    List<Employee> findAll();
    Employee findByEmployeeUser(User employeeUser);
}