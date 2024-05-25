package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.Document;
import com.example.itcompanyautomatization.Models.UserDocumentStatus;

public interface IDocumentRepository extends CrudRepository<Document, String>, JpaSpecificationExecutor<Document> {
    List<Document> findAll();

    List<Document> findBySenderId(String userId);

    List<Document> findByReceiverId(String userId);

    default void delete(IUserDocumentStatusRepository userDocumentStatusRepository, Document document) {
        List<UserDocumentStatus> statuses = userDocumentStatusRepository.findByDocumentId(document.getId());

        for (UserDocumentStatus userDocumentStatus : statuses) {
            userDocumentStatusRepository.delete(userDocumentStatus);
        }

        delete(document);
    }
}