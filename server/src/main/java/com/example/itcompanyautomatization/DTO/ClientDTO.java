package com.example.itcompanyautomatization.DTO;

import com.example.itcompanyautomatization.Models.User;

public class ClientDTO {

    public static class ClientDTORequestBody {
        public String id;
        public UserDTO clientUser;
        public String companyName;
        public String address;
        public String phoneNumber;
        public String additionalInfo;

        public ClientDTORequestBody(String id, UserDTO clientUser, String companyName, String address,
                String phoneNumber,
                String additionalInfo) {
            this.id = id;
            this.clientUser = clientUser;
            this.companyName = companyName;
            this.address = address;
            this.phoneNumber = phoneNumber;
            this.additionalInfo = additionalInfo;
        }
    }

    public String id;
    public User clientUser;
    public String companyName;
    public String address;
    public String phoneNumber;
    public String additionalInfo;

    public ClientDTO(String id, User clientUser, String companyName, String address, String phoneNumber,
            String additionalInfo) {
        this.id = id;
        this.clientUser = clientUser;
        this.companyName = companyName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.additionalInfo = additionalInfo;
    }
}
