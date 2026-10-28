package com.ems.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileRequest {
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String studentCode;
    private String classCode;
}
