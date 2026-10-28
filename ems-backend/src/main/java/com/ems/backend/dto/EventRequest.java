package com.ems.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventRequest {
    @NotBlank(message = "Tên sự kiện không được để trống")
    private String nameEvent;

    private String description;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private String startDate;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private String endDate;

    private String location;

    @NotNull(message = "Hạn đăng ký không được để trống")
    private String registrationDeadline;

    private Integer maxRegistration;
}
