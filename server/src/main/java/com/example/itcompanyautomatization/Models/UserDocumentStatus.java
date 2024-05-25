package com.example.itcompanyautomatization.Models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity // This tells Hibernate to make a table out of this class
public class UserDocumentStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(cascade = CascadeType.MERGE)
    private Document document;

    @ManyToOne(cascade = CascadeType.MERGE)
    private User user;

    private Boolean status;

    public UserDocumentStatus() {
    }

    public UserDocumentStatus(Document document, User user, Boolean status) {
        this.document = document;
        this.user = user;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}