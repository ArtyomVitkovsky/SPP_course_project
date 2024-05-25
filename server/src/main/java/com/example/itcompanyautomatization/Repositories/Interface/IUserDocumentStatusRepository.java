package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.UserDocumentStatus;

public interface IUserDocumentStatusRepository extends CrudRepository<UserDocumentStatus, String>, JpaSpecificationExecutor<UserDocumentStatus> {
    List<UserDocumentStatus> findAll();
    Optional<UserDocumentStatus> findByUserIdAndDocumentId(String userId, String documentId);
    List<UserDocumentStatus> findByDocumentId(String documentId);
    List<UserDocumentStatus> findByUserId(String userId);
}