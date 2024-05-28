package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.ProjectStatus;

public interface IProjectStatusRepository extends CrudRepository<ProjectStatus, String>{
    List<ProjectStatus> findAll();
}
