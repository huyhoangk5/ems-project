package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEvent")
    private Integer idEvent;

    @Column(name = "nameEvent", nullable = false, length = 255)
    private String nameEvent;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image", length = 255)
    private String image;

    @Column(name = "startDate", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "endDate", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "registrationDeadline", nullable = false)
    private LocalDateTime registrationDeadline;

    @Column(name = "maxRegistration")
    private Integer maxRegistration;

    @Column(name = "numberOfRegistration")
    private Integer numberOfRegistration;

    @Column(name = "status", nullable = false, length = 255)
    private String status;

    @Column(name = "rejectionReason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approvedBy")
    private User approver;

    @Column(name = "approvedDate")
    private LocalDateTime approvedDate;

    @Column(name = "isDeleted")
    private Boolean isDeleted;

    @Column(name = "createdDate", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updatedDate", nullable = false)
    private LocalDateTime updatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idClub", nullable = false)
    private Club club;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
        if (numberOfRegistration == null) numberOfRegistration = 0;
        if (isDeleted == null) isDeleted = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}
