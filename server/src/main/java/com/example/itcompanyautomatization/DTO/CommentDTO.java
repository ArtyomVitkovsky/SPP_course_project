package com.example.itcompanyautomatization.DTO;

public class CommentDTO {
    public String id;
    public String employeeId;
    public String text;

    public CommentDTO(String id, String employeeId, String text) {
        this.id = id;
        this.employeeId = employeeId;
        this.text = text;
    }
}
