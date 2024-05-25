package com.example.itcompanyautomatization.Models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity // This tells Hibernate to make a table out of this class
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(cascade = CascadeType.ALL)
    private User employeeUser;

    @ManyToOne(cascade = CascadeType.MERGE)
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