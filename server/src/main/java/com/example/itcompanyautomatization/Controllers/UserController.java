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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.itcompanyautomatization.DTO.UserDTO;
import com.example.itcompanyautomatization.DTO.UserRoleDTO;
import com.example.itcompanyautomatization.Models.User;
import com.example.itcompanyautomatization.Models.UserRole;
import com.example.itcompanyautomatization.Repositories.Interface.IClientRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IDocumentRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IEmployeeRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IUserDocumentStatusRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IUserRepository;
import com.example.itcompanyautomatization.Repositories.Interface.IUserRoleRepository;
import com.example.itcompanyautomatization.Utils.StringUtilities;

@Controller
@RequestMapping(path = "/users")
public class UserController {

    private IUserRepository userRepository;
    private IUserRoleRepository userRoleRepository;
    private IUserDocumentStatusRepository userDocumentStatusRepository;
    private IDocumentRepository documentRepository;
    private IEmployeeRepository employeeRepository;
    private IClientRepository clientRepository;

    public UserController(
            IUserRepository userRepository,
            IUserRoleRepository userRoleRepository,
            IUserDocumentStatusRepository userDocumentStatusRepository,
            IDocumentRepository documentRepository,
            IEmployeeRepository employeeRepository,
            IClientRepository clientRepository) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.userDocumentStatusRepository = userDocumentStatusRepository;
        this.documentRepository = documentRepository;
        this.employeeRepository = employeeRepository;
        this.clientRepository = clientRepository;
    }

    @PostMapping(path = "/setUser")
    public @ResponseBody ResponseEntity<?> setUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO savedUser = saveUserData(userDTO);
            return ResponseEntity.status(200).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    private UserDTO saveUserData(UserDTO userDTO) throws Exception {
        User userToSave;

        Optional<User> existedUser = getUserFromRepository(userDTO.id);

        if (existedUser != null && existedUser.isPresent()) {
            userToSave = existedUser.get();

            userToSave.setFirstName(userDTO.firstName);
            userToSave.setLastName(userDTO.lastName);
            userToSave.setEmail(userDTO.email);
            userToSave.setPassword(userDTO.email);
            userToSave.setRole(userDTO.role);
        } else {

            existedUser = getUserByEmailFromRepository(userDTO.email);
            if (existedUser != null && existedUser.isPresent()) {
                throw new Exception(String.format("User with same email [%s] already exists", userDTO.email));
            }

            userToSave = new User(
                    userDTO.firstName,
                    userDTO.lastName,
                    userDTO.email,
                    userDTO.password,
                    userDTO.role);
        }

        User savedUser = userRepository.save(userToSave);
        return new UserDTO(savedUser);
    }

    @PostMapping(path = "/deleteUser")
    public @ResponseBody ResponseEntity<String> deleteUser(@RequestBody UserDTO userDTO) {
        try {
            Optional<User> existingUser = getUserFromRepository(userDTO.id);

            if (existingUser == null || !existingUser.isPresent())
                return ResponseEntity.status(400).body("User not found!");

            User user = existingUser.get();

            userRepository.delete(documentRepository, employeeRepository, clientRepository,
                    userDocumentStatusRepository, user);

            return ResponseEntity.status(200).body("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getUsers")
    public @ResponseBody ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();

            List<UserDTO> userDTOs = new ArrayList<>();
            users.forEach(user -> {
                userDTOs.add(new UserDTO(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getRole()));
            });

            return ResponseEntity.status(200).body(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/authorizeUser")
    public @ResponseBody ResponseEntity<?> getUser(@RequestParam UserDTO userDTO) {
        try {
            Optional<User> user = getUserByEmailAndPasswordFromRepository(userDTO.email, userDTO.password);
            Optional<User> userByEmail = getUserByEmailFromRepository(userDTO.email);

            if (user != null && user.isPresent())
                return ResponseEntity.status(200).body(user.get());

            if (userByEmail != null && userByEmail.isPresent())
                return ResponseEntity.status(400).body("Wrong password!");

            return ResponseEntity.status(400).body("User with that email not registred");

        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/getUserRoles")
    public @ResponseBody ResponseEntity<?> getUserRoles() {
        try {
            List<UserRole> userRoles = userRoleRepository.findAll();

            if (userRoles == null || userRoles.isEmpty())
                return ResponseEntity.status(400).body("No user roles found");

            List<UserRoleDTO> userRoleDTOs = new ArrayList<>();

            userRoles.forEach(role -> {
                userRoleDTOs.add(new UserRoleDTO(role.getId(), role.getRole()));
            });

            return ResponseEntity.status(200).body(userRoleDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    private Optional<User> getUserFromRepository(String id) {
        return StringUtilities.IsNullOrEmpty(id) ? null : userRepository.findById(id);
    }

    private Optional<User> getUserByEmailFromRepository(String email) {
        return StringUtilities.IsNullOrEmpty(email)
                ? null
                : userRepository.findByEmail(email);
    }

    private Optional<User> getUserByEmailAndPasswordFromRepository(String email, String password) {
        return StringUtilities.IsNullOrEmpty(email) && StringUtilities.IsNullOrEmpty(password)
                ? null
                : userRepository.findByEmailAndPassword(email, password);
    }
}