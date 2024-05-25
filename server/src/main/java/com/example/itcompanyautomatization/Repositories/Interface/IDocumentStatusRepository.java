package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.DocumentStatus;

public interface IDocumentStatusRepository extends CrudRepository<DocumentStatus, String> {
    Optional<DocumentStatus> findByStatus(String status);
}