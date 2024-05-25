package com.example.itcompanyautomatization.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class DocumentStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String status;

    public DocumentStatus() {
    }

    public DocumentStatus(String id, String status) {
        this.id = id;
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
