package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRegistration")
    private Integer idRegistration;

    @Column(name = "registrationDate", nullable = false)
    private LocalDateTime registrationDate;

    @Column(name = "status", nullable = false, length = 255)
    private String status;

    @Column(name = "cancelledDate")
    private LocalDateTime cancelledDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idEvent", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idStudent", nullable = false)
    private User student;

    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) registrationDate = LocalDateTime.now();
    }
}
