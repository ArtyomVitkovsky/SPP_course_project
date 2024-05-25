package com.example.itcompanyautomatization.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class EmployeeStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String status;

    public EmployeeStatus() {
    }

    public EmployeeStatus(String status) {

        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}