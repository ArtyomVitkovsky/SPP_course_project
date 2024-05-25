package com.example.itcompanyautomatization.DTO;

import com.example.itcompanyautomatization.Models.Document;
import com.example.itcompanyautomatization.Models.User;

public class UserDocumentStatusDTO {
    public String id;
    public Document document;
    public User user;
    public Boolean status;

    public UserDocumentStatusDTO(String id, Document document, User user,  Boolean status) {
        this.id = id;
        this.document = document;
        this.user = user;
        this.status = status;
    }
}
