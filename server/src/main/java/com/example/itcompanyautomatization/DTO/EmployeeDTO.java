package com.example.itcompanyautomatization.DTO;

import com.example.itcompanyautomatization.Models.EmployeeStatus;
import com.example.itcompanyautomatization.Models.User;

public class EmployeeDTO {
    public static class EmployeeDTORequestBody {
        public String id;
        public UserDTO employeeUser;
        public EmployeeStatusDTO status;

        public EmployeeDTORequestBody(String id,
                UserDTO employeeUser,
                EmployeeStatusDTO status) {
            this.id = id;
            this.employeeUser = employeeUser;
            this.status = status;
        }
    }

    public String id;
    public User employeeUser;
    public EmployeeStatus status;

    public EmployeeDTO(
            String id,
            User employeeUser,
            EmployeeStatus status) {
        this.id = id;
        this.employeeUser = employeeUser;
        this.status = status;
    }
}
