package com.ems.backend.controller;

import com.ems.backend.dto.*;
import com.ems.backend.entity.Organization;
import com.ems.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllUsers()));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Tạo tài khoản thành công", adminService.createUser(request)));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Integer id,
                                                                 @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", adminService.updateUser(id, request)));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Integer id, java.security.Principal principal) {
        adminService.toggleUserStatus(id, principal != null ? principal.getName() : null);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id, java.security.Principal principal) {
        adminService.deleteUser(id, principal != null ? principal.getName() : null);
        return ResponseEntity.ok(ApiResponse.ok("Xóa tài khoản thành công", null));
    }

    @GetMapping("/organizations")
    public ResponseEntity<ApiResponse<List<Organization>>> getOrganizations() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllOrganizations()));
    }
}
