package com.ems.backend.dto;

import lombok.Data;

@Data
public class ApprovalRequest {
    private String action; // "APPROVE" or "REJECT"
    private String reason; // required if action = "REJECT"
}
