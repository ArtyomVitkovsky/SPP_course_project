package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.DTO.ProjecCreationRequestDTO;
import com.example.itcompanyautomatization.Models.Document;
import com.example.itcompanyautomatization.Models.DocumentReceiveNotification;
import com.example.itcompanyautomatization.Models.ProjectCreationRequest;
import com.example.itcompanyautomatization.Models.UserDocumentStatus;

public interface IDocumentRepository extends CrudRepository<Document, String>, JpaSpecificationExecutor<Document> {
    List<Document> findAll();

    List<Document> findBySenderId(String userId);

    List<Document> findByReceiverId(String userId);

    default void delete(
        IProjectCreationRequestRepository projectCreationRequestRepository,
        IUserDocumentStatusRepository userDocumentStatusRepository, 
        IDocumentNotificationRepository documentNotificationRepository, 
        Document document) {

        List<UserDocumentStatus> statuses = userDocumentStatusRepository.findByDocumentId(document.getId());
        for (UserDocumentStatus userDocumentStatus : statuses) {
            userDocumentStatusRepository.delete(userDocumentStatus);
        }

        ProjectCreationRequest projecCreationRequest = projectCreationRequestRepository.findByDocumentId(document.getId());
        if(projecCreationRequest != null) projectCreationRequestRepository.delete(projecCreationRequest);

        DocumentReceiveNotification notification = documentNotificationRepository.findByDocumentId(document.getId());
        if(notification != null) documentNotificationRepository.delete(notification);
        
        delete(document);
    }
}