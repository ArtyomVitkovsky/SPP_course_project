package com.example.itcompanyautomatization.Models;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(cascade = CascadeType.MERGE)
    private User sender;

    @ManyToOne(cascade = CascadeType.MERGE)
    private User receiver;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "status_id")
    private DocumentStatus status;

    private String name;

    @Column(columnDefinition = "MEDIUMBLOB")
    private String content;

    private LocalDate creationDate;

    public Document(String name, String content, LocalDate creationDate,
            User sender,
            User receiver,
            DocumentStatus status) {
        this.name = name;
        this.content = content;
        this.creationDate = creationDate;
        this.sender = sender;
        this.receiver = receiver;
        this.status = status;
    }

    public Document() {
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String description) {
        this.content = description;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = this.creationDate == null ? creationDate : this.creationDate;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

}