package com.example.itcompanyautomatization.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;

@Entity // This tells Hibernate to make a table out of this class
public class DocumentReceiveNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(cascade = CascadeType.REFRESH)
    private User user;

    @ManyToOne(cascade = CascadeType.REFRESH)
    private Document document;

    public DocumentReceiveNotification() {
    }

    public DocumentReceiveNotification(User user, Document document) {
        this.user = user;
        this.document = document;
    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }
}
