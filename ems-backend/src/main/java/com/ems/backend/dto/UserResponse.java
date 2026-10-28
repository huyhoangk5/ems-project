package com.ems.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Integer idUser;
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String studentCode;
    private String classCode;
    private String username;
    private String role;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // Club info (if role = CLUB)
    private Integer clubId;
    private String clubName;
    private String clubShortName;
    private String clubDescription;
    private String leaderName;
    private String leaderPhone;
    private String leaderCode;
    private Integer orgId;
    private String orgName;
}
