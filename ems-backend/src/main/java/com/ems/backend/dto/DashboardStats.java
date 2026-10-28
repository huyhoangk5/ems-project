package com.ems.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    // For admin
    private Long totalUsers;
    private Long totalClubs;
    private Long totalApprovers;
    private Long totalStudents;

    // For approver
    private Long totalEvents;
    private Long approvedEvents;
    private Long pendingEvents;
    private Long rejectedEvents;
}
