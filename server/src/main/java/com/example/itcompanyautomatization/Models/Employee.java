package com.example.itcompanyautomatization.Models;

import jakarta.persistence.*;

@Entity // This tells Hibernate to make a table out of this class
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(cascade = CascadeType.ALL)
    private User employeeUser;

    @ManyToOne(cascade = CascadeType.REFRESH)
    private EmployeeStatus status;

    public Employee() {
    }

    public Employee(User employeeUser, EmployeeStatus status) {

        this.employeeUser = employeeUser;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public User getEmployeeUser() {
        return employeeUser;
    }

    public void setEmployeeUser(User employeeUser) {
        this.employeeUser = employeeUser;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
    }
}