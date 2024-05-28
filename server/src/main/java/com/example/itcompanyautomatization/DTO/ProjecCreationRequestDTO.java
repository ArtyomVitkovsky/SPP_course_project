package com.example.itcompanyautomatization.DTO;

import java.util.List;

import com.example.itcompanyautomatization.Models.Client;
import com.example.itcompanyautomatization.Models.Document;
import com.example.itcompanyautomatization.Models.Employee;

public class ProjecCreationRequestDTO {
    public String id;
    public Client client;
    public Employee manager;
    public Document document;
    public List<Employee> employees;
    public String name;

    public ProjecCreationRequestDTO(
            String id,
            Client client,
            Employee manager,
            Document document,
            List<Employee> employees,
            String name) {
        this.id = id;
        this.client = client;
        this.manager = manager;
        this.document = document;
        this.employees = employees;
        this.name = name;
    }
}
