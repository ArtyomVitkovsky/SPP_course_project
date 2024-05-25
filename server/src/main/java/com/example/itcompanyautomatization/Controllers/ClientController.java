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

import com.example.itcompanyautomatization.DTO.ClientDTO;
import com.example.itcompanyautomatization.Models.Client;
import com.example.itcompanyautomatization.Models.User;
import com.example.itcompanyautomatization.Repositories.Interface.IClientRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IUserRepository;
import com.example.itcompanyautomatization.Utils.StringUtilities;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(path = "/clients")
public class ClientController {
    private IClientRepository clientRepository;
    private IUserRepository userRepository;

    public ClientController(IClientRepository clientRepository, IUserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    @PostMapping(path = "/setClient")
    public @ResponseBody ResponseEntity<?> setClient(@RequestBody ClientDTO.ClientDTORequestBody clientDTO) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            Optional<Client> clientResult = getClientById(clientDTO.id);
            Client client = null;

            Optional<User> userResult = userRepository.findById(clientDTO.clientUser.id);
            if (userResult == null || !userResult.isPresent()) {
                return ResponseEntity.status(400).body("User not found");
            }

            if (clientResult != null && clientResult.isPresent()) {
                client = clientResult.get();

                client.setClientUser(userResult.get());
                client.setCompanyName(clientDTO.companyName);
                client.setAddress(clientDTO.address);
                client.setPhoneNumber(clientDTO.phoneNumber);
                client.setAdditionalInfo(clientDTO.additionalInfo);
            } else {
                client = new Client(
                        userResult.get(),
                        clientDTO.companyName,
                        clientDTO.address,
                        clientDTO.phoneNumber,
                        clientDTO.additionalInfo);
            }

            System.out.println("Client to save : " + mapper.writeValueAsString(client));

            Client savedClient = clientRepository.save(client);
            return ResponseEntity.status(200).body(savedClient);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getClients")
    public @ResponseBody ResponseEntity<?> getAllClients() {
        try {
            List<Client> clients = new ArrayList<>(clientRepository.findAll());

            List<ClientDTO> clientDTOs = new ArrayList<>();
            clients.forEach(client -> {
                clientDTOs.add(new ClientDTO(
                        client.getId(),
                        client.getClientUser(),
                        client.getCompanyName(),
                        client.getAddress(),
                        client.getPhoneNumber(),
                        client.getAdditionalInfo()));
            });

            return ResponseEntity.status(200).body(clientDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    private Optional<Client> getClientById(String id) {
        return StringUtilities.IsNullOrEmpty(id)
                ? null
                : clientRepository.findById(id);
    }
}
