package com.ems.backend.controller;

import com.ems.backend.dto.*;
import com.ems.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {

    private final EventService eventService;

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getMyEvents(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getClubEvents(userDetails.getUsername())));
    }

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("event") EventRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        EventResponse event = eventService.createEvent(userDetails.getUsername(), request, image);
        return ResponseEntity.ok(ApiResponse.ok("Đăng tải sự kiện thành công", event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("event") EventRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        EventResponse event = eventService.updateEvent(id, userDetails.getUsername(), request, image);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật sự kiện thành công", event));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        eventService.deleteEvent(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Xóa sự kiện thành công", null));
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEvent(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEvent(id, userDetails.getUsername())));
    }

    @GetMapping("/events/{id}/registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getRegistrations(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                eventService.getEventRegistrations(id, userDetails.getUsername())));
    }
}
