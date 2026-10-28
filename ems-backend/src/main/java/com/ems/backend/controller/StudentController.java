package com.ems.backend.controller;

import com.ems.backend.dto.*;
import com.ems.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final EventService eventService;
    private final RegistrationService registrationService;
    private final ProfileService profileService;

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEvents(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer clubId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword) {
        List<EventResponse> events = eventService.getApprovedEvents(
                userDetails.getUsername(), clubId, startDate, endDate, keyword);
        return ResponseEntity.ok(ApiResponse.ok(events));
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEvent(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEvent(id, userDetails.getUsername())));
    }

    @PostMapping("/events/{id}/register")
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        RegistrationResponse response = registrationService.register(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký thành công", response));
    }

    @DeleteMapping("/events/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        registrationService.cancel(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Đã hủy đăng ký", null));
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                registrationService.getMyRegistrations(userDetails.getUsername())));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                profileService.getProfile(userDetails.getUsername())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileRequest request) {
        UserResponse response = profileService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", response));
    }

    @PutMapping("/profile/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Đổi mật khẩu thành công", null));
    }
}
