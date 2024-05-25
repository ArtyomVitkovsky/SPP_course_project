package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.Client;
import com.example.itcompanyautomatization.Models.Document;
import com.example.itcompanyautomatization.Models.Employee;
import com.example.itcompanyautomatization.Models.User;
import com.example.itcompanyautomatization.Models.UserDocumentStatus;

public interface IUserRepository extends CrudRepository<User, String> {
    List<User> findAll();

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);

    default void delete(
            IDocumentRepository documentRepository,
            IEmployeeRepository employeeRepository,
            IClientRepository clientRepository,
            IUserDocumentStatusRepository userDocumentStatusRepository,
            User user) {
        List<UserDocumentStatus> statuses = userDocumentStatusRepository.findByUserId(user.getId());

        for (UserDocumentStatus userDocumentStatus : statuses) {
            userDocumentStatusRepository.delete(userDocumentStatus);
        }

        List<Document> documents = new ArrayList<>();
        documents.addAll(documentRepository.findBySenderId(user.getId()));
        documents.addAll(documentRepository.findByReceiverId(user.getId()));

        for (Document document : documents) {
            documentRepository.delete(document);
        }

        Employee employee = employeeRepository.findByEmployeeUser(user);
        if (employee != null)
            employeeRepository.delete(employee);

        Client client = clientRepository.findByClientUser(user);
        if (client != null)
            clientRepository.delete(client);

        delete(user);
    }
}