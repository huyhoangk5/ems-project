package com.ems.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private Integer idEvent;
    private String nameEvent;
    private String description;
    private String image;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private LocalDateTime registrationDeadline;
    private Integer maxRegistration;
    private Integer numberOfRegistration;
    private String status;
    private String rejectionReason;
    private Integer clubId;
    private String clubName;
    private String clubShortName;
    private Integer approverId;
    private String approverName;
    private LocalDateTime approvedDate;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    // Computed field for student view
    private String timeStatus; // UPCOMING, ONGOING, ENDED
    private Boolean isRegistered; // for student
}
