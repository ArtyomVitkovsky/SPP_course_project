package com.example.itcompanyautomatization.Controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.example.itcompanyautomatization.DTO.*;
import com.example.itcompanyautomatization.Models.*;
import com.example.itcompanyautomatization.Repositories.Interface.IEmployeeRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IEmployeeStatusRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IUserRepository;
import com.example.itcompanyautomatization.Utils.StringUtilities;

@Controller
@RequestMapping(path = "/employees")
public class EmployeeController {
    @Autowired
    private IEmployeeRepository employeeRepository;
    private IEmployeeStatusRepository employeeStatusRepository;
    private IUserRepository userRepository;

    public EmployeeController(
            IEmployeeRepository employeeRepository,
            IUserRepository userRepository,
            IEmployeeStatusRepository employeeStatusRepository) {
        this.employeeRepository = employeeRepository;
        this.employeeStatusRepository = employeeStatusRepository;
        this.userRepository = userRepository;
    }

    @PostMapping(path = "/setEmployee")
    public @ResponseBody ResponseEntity<?> setEmployee(@RequestBody EmployeeDTO.EmployeeDTORequestBody employeeDTO) {
        try {
            Optional<Employee> employeeResult = getEmployeeFromRepository(employeeDTO.id);
            Employee employee = null;

            Optional<User> userResult = userRepository.findById(employeeDTO.employeeUser.id);
            if (userResult == null || !userResult.isPresent()) {
                return ResponseEntity.status(400).body("User not found");
            }

            Optional<EmployeeStatus> employeeStatusResult = employeeStatusRepository.findById(employeeDTO.status.id);
            if (employeeStatusResult == null || !employeeStatusResult.isPresent()) {
                return ResponseEntity.status(400).body("Employee status not found");
            }

            if (employeeResult != null && employeeResult.isPresent()) {
                employee = employeeResult.get();

                employee.setEmployeeUser(userResult.get());
                employee.setStatus(employeeStatusResult.get());
            } else {
                employee = new Employee(
                        userResult.get(),
                        employeeStatusResult.get());
            }

            Employee savedEmployee = employeeRepository.save(employee);
            return ResponseEntity.status(200).body(savedEmployee);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getEmployees")
    public @ResponseBody ResponseEntity<?> getAllEmployees() {
        try {
            List<Employee> employees = employeeRepository.findAll();

            List<EmployeeDTO> employeeDTOs = new ArrayList<>();
            employees.forEach(employee -> {
                employeeDTOs.add(
                        new EmployeeDTO(
                                employee.getId(),
                                employee.getEmployeeUser(),
                                employee.getStatus()));

            });

            return ResponseEntity.status(200).body(employeeDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getEmployeeStatuses")
    public @ResponseBody ResponseEntity<?> getEmployeeStatuses() {
        try {
            List<EmployeeStatus> employeeStatuses = employeeStatusRepository.findAll();

            List<EmployeeStatusDTO> employeeDTOs = new ArrayList<>();
            employeeStatuses.forEach(employeeStatus -> {
                employeeDTOs.add(
                        new EmployeeStatusDTO(
                                employeeStatus.getId(),
                                employeeStatus.getStatus()));

            });

            return ResponseEntity.status(200).body(employeeDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    private Optional<Employee> getEmployeeFromRepository(String id) {
        return StringUtilities.IsNullOrEmpty(id) ? null : employeeRepository.findById(id);
    }
}