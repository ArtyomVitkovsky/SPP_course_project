package com.example.itcompanyautomatization.Controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.itcompanyautomatization.DTO.ProjecCreationRequestDTO;
import com.example.itcompanyautomatization.DTO.ProjectDTO;
import com.example.itcompanyautomatization.DTO.ProjectStatusDTO;
import com.example.itcompanyautomatization.Models.Project;
import com.example.itcompanyautomatization.Models.ProjectCreationRequest;
import com.example.itcompanyautomatization.Models.ProjectStatus;
import com.example.itcompanyautomatization.Repositories.Interface.IProjectCreationRequestRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IProjectRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IProjectStatusRepository;
import com.example.itcompanyautomatization.Utils.StringUtilities;

@Controller
@RequestMapping(path = "/projects")
public class ProjectController {

    private IProjectRepository projectRepository;
    private IProjectStatusRepository projectStatusRepository;
    private IProjectCreationRequestRepository projectCreationRequestRepository;

    public ProjectController(
            IProjectRepository projectRepository,
            IProjectStatusRepository clientRepository,
            IProjectCreationRequestRepository projectCreationRequestRepository) {
        this.projectRepository = projectRepository;
        this.projectStatusRepository = clientRepository;
        this.projectCreationRequestRepository = projectCreationRequestRepository;
    }

    @PostMapping(path = "/setProject")
    public @ResponseBody ResponseEntity<?> setProject(@RequestBody ProjectDTO projectDTO) {
        try {
            Project projectToSave;

            Optional<Project> existedProject = getProjectFromRepository(projectDTO.id);

            if (existedProject != null && existedProject.isPresent()) {
                projectToSave = existedProject.get();

                projectToSave.setClient(projectDTO.client);
                projectToSave.setEmployees(projectDTO.employees);
                projectToSave.setName(projectDTO.name);
                projectToSave.setManager(projectDTO.manager);
                projectToSave.setStatus(projectDTO.status);
            } else {
                projectToSave = new Project(
                        projectDTO.client,
                        projectDTO.name,
                        projectDTO.manager,
                        projectDTO.employees,
                        projectDTO.status);
            }

            Project savedProject = projectRepository.save(projectToSave);
            return ResponseEntity.status(200).body(savedProject);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getProjects")
    public @ResponseBody ResponseEntity<?> getAllProjects() {
        try {
            List<Project> projects = projectRepository.findAll();

            List<ProjectDTO> projectDTOs = new ArrayList<>();
            projects.forEach(project -> {
                projectDTOs.add(new ProjectDTO(
                        project.getId(),
                        project.getStatus(),
                        project.getClient(),
                        project.getManager(),
                        project.getEmployees(),
                        project.getName()));
            });

            return ResponseEntity.status(200).body(projectDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getProjectStatuses")
    public @ResponseBody ResponseEntity<?> getProjectStatuses() {
        try {
            List<ProjectStatus> projectStatuses = projectStatusRepository.findAll();

            List<ProjectStatusDTO> projectRoleDTOs = new ArrayList<>();

            projectStatuses.forEach(status -> {
                projectRoleDTOs.add(new ProjectStatusDTO(status.getId(), status.getStatus()));
            });

            return ResponseEntity.status(200).body(projectRoleDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getProjectCreationRequests")
    public @ResponseBody ResponseEntity<?> getProjectCreationRequests() {
        try {
            List<ProjectCreationRequest> projects = projectCreationRequestRepository.findAll();

            List<ProjecCreationRequestDTO> projectCreationRequestDTOs = new ArrayList<>();
            projects.forEach(project -> {
                projectCreationRequestDTOs.add(new ProjecCreationRequestDTO(
                        project.getId(),
                        project.getClient(),
                        project.getManager(),
                        project.getDocument(),
                        project.getEmployees(),
                        project.getName()));
            });

            return ResponseEntity.status(200).body(projectCreationRequestDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(path = "/setProjectCreationRequest")
    public @ResponseBody ResponseEntity<?> setProjectCreationRequest(@RequestBody ProjecCreationRequestDTO projectCreqtionRequestDTO) {
        try {
            ProjectCreationRequest projectCreationRequestToSave;

            Optional<ProjectCreationRequest> existedProjectCreationRequest = getProjectCreationRequestFromRepository(projectCreqtionRequestDTO.id);

            if (existedProjectCreationRequest != null && existedProjectCreationRequest.isPresent()) {
                projectCreationRequestToSave = existedProjectCreationRequest.get();

                projectCreationRequestToSave.setClient(projectCreqtionRequestDTO.client);
                projectCreationRequestToSave.setEmployees(projectCreqtionRequestDTO.employees);
                projectCreationRequestToSave.setName(projectCreqtionRequestDTO.name);
                projectCreationRequestToSave.setManager(projectCreqtionRequestDTO.manager);
            } else {
                projectCreationRequestToSave = new ProjectCreationRequest(
                        projectCreqtionRequestDTO.client,
                        projectCreqtionRequestDTO.name,
                        projectCreqtionRequestDTO.manager,
                        projectCreqtionRequestDTO.document,
                        projectCreqtionRequestDTO.employees);
            }

            ProjectCreationRequest savedProject = projectCreationRequestRepository.save(projectCreationRequestToSave);
            return ResponseEntity.status(200).body(savedProject);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    private Optional<Project> getProjectFromRepository(String id) {
        return StringUtilities.IsNullOrEmpty(id) ? null : projectRepository.findById(id);
    }

    private Optional<ProjectCreationRequest> getProjectCreationRequestFromRepository(String id) {
        return StringUtilities.IsNullOrEmpty(id) ? null : projectCreationRequestRepository.findById(id);
    }
}