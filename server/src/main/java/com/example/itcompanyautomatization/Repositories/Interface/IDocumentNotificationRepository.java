package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.DocumentReceiveNotification;

public interface IDocumentNotificationRepository extends CrudRepository<DocumentReceiveNotification, String> {
    List<DocumentReceiveNotification> findAll();
    DocumentReceiveNotification findByUserIdAndDocumentId(String userId, String documentId);
    DocumentReceiveNotification findByDocumentId(String documentId);
}