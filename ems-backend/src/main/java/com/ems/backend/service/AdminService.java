package com.ems.backend.service;

import com.ems.backend.dto.*;
import com.ems.backend.entity.*;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalUsers(userRepository.countByRoleNot("ADMIN"));
        stats.setTotalClubs(userRepository.countByRole("CLUB"));
        stats.setTotalApprovers(userRepository.countByRole("APPROVER"));
        stats.setTotalStudents(userRepository.countByRole("STUDENT"));
        return stats;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAllExceptAdmin().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName() != null ? request.getFullName() : request.getUsername())
                .role(request.getRole())
                .status("ACTIVE")
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .studentCode(request.getStudentCode())
                .classCode(request.getClassCode())
                .build();

        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty())
            user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));

        User savedUser = userRepository.save(user);

        if ("CLUB".equals(request.getRole())) {
            Organization org = null;
            if (request.getIdOrg() != null) {
                org = organizationRepository.findById(request.getIdOrg()).orElse(null);
            }
            if (org == null) {
                org = organizationRepository.findAll().stream().findFirst().orElse(null);
            }

            Club club = Club.builder()
                    .clubName(request.getClubName() != null ? request.getClubName() : savedUser.getUsername())
                    .shortName(request.getClubShortName())
                    .description(request.getDescription())
                    .leaderName(request.getLeaderName())
                    .leaderPhone(request.getLeaderPhone())
                    .leaderCode(request.getLeaderCode())
                    .organization(org)
                    .user(savedUser)
                    .build();
            clubRepository.save(club);
        }

        return toUserResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUser(Integer id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPassword() != null && !request.getPassword().isEmpty())
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getStudentCode() != null) user.setStudentCode(request.getStudentCode());
        if (request.getClassCode() != null) user.setClassCode(request.getClassCode());
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty())
            user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));

        User saved = userRepository.save(user);

        if ("CLUB".equals(user.getRole())) {
            clubRepository.findByUserId(id).ifPresent(club -> {
                if (request.getClubName() != null) club.setClubName(request.getClubName());
                if (request.getClubShortName() != null) club.setShortName(request.getClubShortName());
                if (request.getDescription() != null) club.setDescription(request.getDescription());
                if (request.getLeaderName() != null) club.setLeaderName(request.getLeaderName());
                if (request.getLeaderPhone() != null) club.setLeaderPhone(request.getLeaderPhone());
                if (request.getLeaderCode() != null) club.setLeaderCode(request.getLeaderCode());
                if (request.getIdOrg() != null)
                    organizationRepository.findById(request.getIdOrg()).ifPresent(club::setOrganization);
                clubRepository.save(club);
            });
        }

        return toUserResponse(saved);
    }

    @Transactional
    public void toggleUserStatus(Integer id, String currentUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
        if (currentUsername != null && user.getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("Không thể khóa tài khoản đang đăng nhập.");
        }
        user.setStatus("ACTIVE".equals(user.getStatus()) ? "LOCKED" : "ACTIVE");
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Integer id, String currentUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
        if (currentUsername != null && user.getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("Không thể xóa tài khoản đang đăng nhập.");
        }
        clubRepository.findByUserId(id).ifPresent(clubRepository::delete);
        userRepository.deleteById(id);
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    private UserResponse toUserResponse(User user) {
        UserResponse r = new UserResponse();
        r.setIdUser(user.getIdUser());
        r.setFullName(user.getFullName());
        r.setGender(user.getGender());
        r.setDateOfBirth(user.getDateOfBirth());
        r.setPhoneNumber(user.getPhoneNumber());
        r.setStudentCode(user.getStudentCode());
        r.setClassCode(user.getClassCode());
        r.setUsername(user.getUsername());
        r.setRole(user.getRole());
        r.setStatus(user.getStatus());
        r.setCreatedDate(user.getCreatedDate());
        r.setUpdatedDate(user.getUpdatedDate());

        if ("CLUB".equals(user.getRole())) {
            clubRepository.findByUserId(user.getIdUser()).ifPresent(club -> {
                r.setClubId(club.getIdClub());
                r.setClubName(club.getClubName());
                r.setClubShortName(club.getShortName());
                r.setClubDescription(club.getDescription());
                r.setLeaderName(club.getLeaderName());
                r.setLeaderPhone(club.getLeaderPhone());
                r.setLeaderCode(club.getLeaderCode());
                if (club.getOrganization() != null) {
                    r.setOrgId(club.getOrganization().getIdOrg());
                    r.setOrgName(club.getOrganization().getOrgName());
                }
            });
        }
        return r;
    }
}
