package com.ems.backend.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;
    private String fullName;
    private String role;
    private String gender;
    private String dateOfBirth;
    private String phoneNumber;
    private String studentCode;
    private String classCode;

    // Club-specific fields
    private String clubName;
    private String clubShortName;
    private String description;
    private String leaderName;
    private String leaderPhone;
    private String leaderCode;
    private Integer idOrg;

    // Approver-specific fields
    private String organization;
    private String managerName;
    private String managerPhone;
    private String staffCode;
}
