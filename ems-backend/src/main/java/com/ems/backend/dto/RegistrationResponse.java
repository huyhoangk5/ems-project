package com.ems.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistrationResponse {
    private Integer idRegistration;
    private LocalDateTime registrationDate;
    private String status;
    private LocalDateTime cancelledDate;
    private Integer eventId;
    private String eventName;
    private String eventLocation;
    private LocalDateTime eventStartDate;
    private LocalDateTime eventEndDate;
    private String clubName;
    private Integer studentId;
    private String studentName;
    private String studentCode;
    private String classCode;
    private String phoneNumber;
    private String gender;
}
