package com.ems.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Integer idNotification;
    private String title;
    private String content;
    private String type;
    private LocalDateTime createdDate;
    private Boolean isRead;
}
