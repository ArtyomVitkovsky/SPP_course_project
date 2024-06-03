package com.example.itcompanyautomatization.DTO;

import com.example.itcompanyautomatization.Models.Document;
import com.example.itcompanyautomatization.Models.User;

public class DocumentReceiveNotificationDTO {
    private String id;
    private User user;
    private Document document;

    public DocumentReceiveNotificationDTO(String id, User user, Document document) {
        this.id = id;
        this.user = user;
        this.document = document;
    }
}
