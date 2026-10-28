package com.ems.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clubs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idClub")
    private Integer idClub;

    @Column(name = "clubName", nullable = false, length = 255)
    private String clubName;

    @Column(name = "shortName", length = 50)
    private String shortName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "leaderName", length = 255)
    private String leaderName;

    @Column(name = "leaderPhone", length = 20)
    private String leaderPhone;

    @Column(name = "leaderCode", length = 50)
    private String leaderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrg", nullable = true)
    private Organization organization;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idUser", nullable = false)
    private User user;

    @Column(name = "createdDate", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updatedDate", nullable = false)
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}
