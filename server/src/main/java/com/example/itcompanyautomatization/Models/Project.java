package com.example.itcompanyautomatization.Models;

import java.util.List;

import jakarta.persistence.*;

@Entity // This tells Hibernate to make a table out of this class
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @OneToMany(cascade = CascadeType.MERGE)
    private List<Employee> employees;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "status_id")
    private ProjectStatus status;

    private String name;

    public Project() {
    }

    public Project(
            Client client,
            String name,
            Employee manager,
            List<Employee> employees,
            ProjectStatus status) {
        this.client = client;
        this.name = name;
        this.manager = manager;
        this.employees = employees;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Employee getManager() {
        return manager;
    }

    public void setManager(Employee manager) {
        this.manager = manager;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
}