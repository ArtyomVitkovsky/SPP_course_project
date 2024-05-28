package com.example.itcompanyautomatization.Models;

import java.util.List;

import jakarta.persistence.*;

@Entity // This tells Hibernate to make a table out of this class
public class ProjectCreationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @OneToOne(cascade = CascadeType.REFRESH)
    private Document document;

    @OneToMany(cascade = CascadeType.MERGE)
    private List<Employee> employees;

    private String name;

    public ProjectCreationRequest() {
    }

    public ProjectCreationRequest(
            Client client,
            String name,
            Employee manager,
            Document document,
            List<Employee> employees) {
        this.client = client;
        this.name = name;
        this.manager = manager;
        this.document = document;
        this.employees = employees;
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

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }
}