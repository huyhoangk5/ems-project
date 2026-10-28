package com.ems.backend.controller;

import com.ems.backend.dto.*;
import com.ems.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approver")
@RequiredArgsConstructor
public class ApproverController {

    private final EventService eventService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getApproverStats()));
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getAllEvents()));
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEvent(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEvent(id, userDetails.getUsername())));
    }

    @PatchMapping("/events/{id}/review")
    public ResponseEntity<ApiResponse<EventResponse>> reviewEvent(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ApprovalRequest request) {
        EventResponse response = eventService.approveOrReject(id, userDetails.getUsername(), request);
        String msg = "APPROVE".equals(request.getAction()) ? "Phê duyệt thành công" : "Từ chối thành công";
        return ResponseEntity.ok(ApiResponse.ok(msg, response));
    }
}
