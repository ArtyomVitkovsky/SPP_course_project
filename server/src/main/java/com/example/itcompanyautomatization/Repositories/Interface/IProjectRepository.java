package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.Project;

public interface IProjectRepository extends CrudRepository<Project, String> {
    List<Project> findAll();
}
