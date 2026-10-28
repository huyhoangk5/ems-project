package com.ems.backend.service;

import com.ems.backend.dto.ChangePasswordRequest;
import com.ems.backend.dto.ProfileRequest;
import com.ems.backend.dto.UserResponse;
import com.ems.backend.entity.User;
import com.ems.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toUserResponse(user);
    }

    public UserResponse updateProfile(String username, ProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setFullName(request.getFullName());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setStudentCode(request.getStudentCode());
        user.setClassCode(request.getClassCode());

        return toUserResponse(userRepository.save(user));
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải có tối thiểu 6 ký tự");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserResponse toUserResponse(User user) {
        UserResponse res = new UserResponse();
        res.setIdUser(user.getIdUser());
        res.setFullName(user.getFullName());
        res.setGender(user.getGender());
        res.setDateOfBirth(user.getDateOfBirth());
        res.setPhoneNumber(user.getPhoneNumber());
        res.setStudentCode(user.getStudentCode());
        res.setClassCode(user.getClassCode());
        res.setUsername(user.getUsername());
        res.setRole(user.getRole());
        res.setStatus(user.getStatus());
        res.setCreatedDate(user.getCreatedDate());
        res.setUpdatedDate(user.getUpdatedDate());
        return res;
    }
}
