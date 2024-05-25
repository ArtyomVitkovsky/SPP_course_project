package com.example.itcompanyautomatization.DTO;

import java.time.LocalDate;
import com.example.itcompanyautomatization.Models.DocumentStatus;
import com.example.itcompanyautomatization.Models.User;

public class DocumentDTO {
    public String id;
    public String name;
    public String content;
    public LocalDate creationDate;
    public User sender;
    public User receiver;
    public DocumentStatus status;

    public DocumentDTO(String id, String name, String content, LocalDate creationDate,
            User sender,
            User receiver,
            DocumentStatus status) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.creationDate = creationDate;
        this.sender = sender;
        this.receiver = receiver;
        this.status = status;
    }

}
