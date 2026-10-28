package com.ems.backend.service;

import com.ems.backend.dto.*;
import com.ems.backend.entity.User;
import com.ems.backend.repository.UserRepository;
import com.ems.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Sai tên đăng nhập hoặc mật khẩu. Hãy thử lại!"));

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new DisabledException("Tài khoản đã bị khóa. Vui lòng liên hệ Quản trị viên hệ thống");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        return new LoginResponse(token, user.getRole(), user.getIdUser(), user.getFullName(), user.getUsername());
    }

    public void register(RegisterRequest request) {
        if (request.getUsername() == null || !request.getUsername().matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Tên đăng nhập chỉ cho phép chữ cái, chữ số và dấu gạch dưới");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải có tối thiểu 6 ký tự");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("STUDENT")
                .status("ACTIVE")
                .build();

        userRepository.save(user);
    }
}
