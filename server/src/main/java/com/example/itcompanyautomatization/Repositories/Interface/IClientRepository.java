package com.example.itcompanyautomatization.Repositories.Interface;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.itcompanyautomatization.Models.Client;
import com.example.itcompanyautomatization.Models.User;

public interface IClientRepository extends CrudRepository<Client, String> {
    List<Client> findAll();

    Client findByClientUser(User user);
}