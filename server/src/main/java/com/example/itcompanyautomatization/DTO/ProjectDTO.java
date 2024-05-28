package com.example.itcompanyautomatization.DTO;

import java.time.LocalDate;
import java.util.List;

import com.example.itcompanyautomatization.Models.Client;
import com.example.itcompanyautomatization.Models.Employee;
import com.example.itcompanyautomatization.Models.ProjectStatus;

public class ProjectDTO {

    public static class ProjectRequestBodyDTO {
        public ProjectStatus status;
        public Client client;
        public Employee manager;
        public List<Employee> employees;
        public String name;
        public LocalDate creationDate;

        public ProjectRequestBodyDTO(
                ProjectStatus status,
                Client client,
                Employee manager,
                List<Employee> employees,
                String name,
                LocalDate creationDate) {
            this.status = status;
            this.client = client;
            this.manager = manager;
            this.employees = employees;
            this.name = name;
            this.creationDate = creationDate;
        }
    }

    public String id;
    public ProjectStatus status;
    public Client client;
    public Employee manager;
    public List<Employee> employees;
    public String name;

    public ProjectDTO(
            String id,
            ProjectStatus status,
            Client client,
            Employee manager,
            List<Employee> employees,
            String name) {
        this.id = id;
        this.status = status;
        this.client = client;
        this.manager = manager;
        this.employees = employees;
        this.name = name;
    }
}
