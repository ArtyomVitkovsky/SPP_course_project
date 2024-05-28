package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.ProjectCreationRequest;

public interface IProjectCreationRequestRepository extends CrudRepository<ProjectCreationRequest, String> {
    List<ProjectCreationRequest> findAll();
}
