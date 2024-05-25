package com.example.itcompanyautomatization.DTO;

import com.example.itcompanyautomatization.Models.User;
import com.example.itcompanyautomatization.Models.UserRole;

public class UserDTO {
    public String id;
    public String firstName;
    public String lastName;
    public String email;
    public String password;
    public UserRole role;

    public UserDTO(
            String id,
            String firstName,
            String lastName,
            String email,
            String password,
            UserRole role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public UserDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
    }
}
