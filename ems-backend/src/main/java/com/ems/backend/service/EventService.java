package com.ems.backend.service;

import com.ems.backend.dto.*;
import com.ems.backend.entity.*;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    // ===== CLUB: Create Event =====
    @Transactional
    public EventResponse createEvent(String username, EventRequest req, MultipartFile image) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Club club = clubRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy CLB của bạn"));

        Event event = Event.builder()
                .nameEvent(req.getNameEvent())
                .description(req.getDescription())
                .startDate(LocalDateTime.parse(req.getStartDate(), DT_FMT))
                .endDate(LocalDateTime.parse(req.getEndDate(), DT_FMT))
                .location(req.getLocation())
                .registrationDeadline(LocalDateTime.parse(req.getRegistrationDeadline(), DT_FMT))
                .maxRegistration(req.getMaxRegistration())
                .numberOfRegistration(0)
                .status("PENDING")
                .isDeleted(false)
                .club(club)
                .build();

        if (image != null && !image.isEmpty()) {
            event.setImage(fileStorageService.storeFile(image));
        }

        return toEventResponse(eventRepository.save(event), null);
    }

    // ===== CLUB: Update Event =====
    @Transactional
    public EventResponse updateEvent(Integer id, String username, EventRequest req, MultipartFile image) throws IOException {
        Event event = getEventOwnedByClubUser(id, username);
        event.setNameEvent(req.getNameEvent());
        event.setDescription(req.getDescription());
        event.setStartDate(LocalDateTime.parse(req.getStartDate(), DT_FMT));
        event.setEndDate(LocalDateTime.parse(req.getEndDate(), DT_FMT));
        event.setLocation(req.getLocation());
        event.setRegistrationDeadline(LocalDateTime.parse(req.getRegistrationDeadline(), DT_FMT));
        if (req.getMaxRegistration() != null) {
            long currentCount = registrationRepository.countRegisteredByEventId(event.getIdEvent());
            if (req.getMaxRegistration() < currentCount) {
                throw new IllegalArgumentException("Số người tối đa không được nhỏ hơn số người đã đăng ký");
            }
        }
        event.setMaxRegistration(req.getMaxRegistration());
        if (image != null && !image.isEmpty()) {
            if (event.getImage() != null) fileStorageService.deleteFile(event.getImage());
            event.setImage(fileStorageService.storeFile(image));
        }
        return toEventResponse(eventRepository.save(event), null);
    }

    // ===== CLUB: Delete Event =====
    @Transactional
    public void deleteEvent(Integer id, String username) {
        Event event = getEventOwnedByClubUser(id, username);
        event.setIsDeleted(true);
        eventRepository.save(event);
    }

    // ===== CLUB: List My Events =====
    public List<EventResponse> getClubEvents(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Club club = clubRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy CLB của bạn"));
        return eventRepository.findByClubAndIsDeletedFalse(club).stream()
                .map(e -> toEventResponse(e, null))
                .collect(Collectors.toList());
    }

    // ===== APPROVER: List All Events =====
    public List<EventResponse> getAllEvents() {
        return eventRepository.findByIsDeletedFalse().stream()
                .map(e -> toEventResponse(e, null))
                .collect(Collectors.toList());
    }

    // ===== APPROVER: Approve/Reject =====
    @Transactional
    public EventResponse approveOrReject(Integer id, String username, ApprovalRequest req) {
        Event event = eventRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));
        User approver = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("APPROVE".equals(req.getAction())) {
            event.setStatus("APPROVED");
            event.setApprover(approver);
            event.setApprovedDate(LocalDateTime.now());
            event.setRejectionReason(null);
            notificationService.send(event.getClub().getUser(),
                    "Sự kiện được duyệt",
                    "Sự kiện \"" + event.getNameEvent() + "\" đã được phê duyệt.",
                    "APPROVAL");
        } else if ("REJECT".equals(req.getAction())) {
            if (req.getReason() == null || req.getReason().isBlank())
                throw new IllegalArgumentException("Vui lòng nhập lý do từ chối");
            event.setStatus("REJECTED");
            event.setApprover(approver);
            event.setApprovedDate(LocalDateTime.now());
            event.setRejectionReason(req.getReason());
            notificationService.send(event.getClub().getUser(),
                    "Sự kiện bị từ chối",
                    "Sự kiện \"" + event.getNameEvent() + "\" bị từ chối. Lý do: " + req.getReason(),
                    "REJECTION");
        } else {
            throw new IllegalArgumentException("Hành động không hợp lệ");
        }

        return toEventResponse(eventRepository.save(event), null);
    }

    // ===== APPROVER: Stats =====
    public DashboardStats getApproverStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalEvents(eventRepository.countByIsDeletedFalse());
        stats.setApprovedEvents(eventRepository.countByStatusAndIsDeletedFalse("APPROVED"));
        stats.setPendingEvents(eventRepository.countByStatusAndIsDeletedFalse("PENDING"));
        stats.setRejectedEvents(eventRepository.countByStatusAndIsDeletedFalse("REJECTED"));
        return stats;
    }

    // ===== STUDENT: Browse Approved Events =====
    public List<EventResponse> getApprovedEvents(String username, Integer clubId,
                                                  String startDate, String endDate, String keyword) {
        LocalDateTime start = (startDate != null && !startDate.isBlank())
                ? LocalDateTime.parse(startDate.length() > 16 ? startDate.substring(0, 16) : startDate, DT_FMT) : null;
        LocalDateTime end = (endDate != null && !endDate.isBlank())
                ? LocalDateTime.parse(endDate.length() > 16 ? endDate.substring(0, 16) : endDate, DT_FMT) : null;
        String kw = (keyword != null && keyword.isBlank()) ? null : keyword;

        User student = (username != null) ? userRepository.findByUsername(username).orElse(null) : null;

        return eventRepository.findApprovedEventsWithFilters(clubId, start, end, kw).stream()
                .map(e -> toEventResponse(e, student))
                .collect(Collectors.toList());
    }

    // ===== Get One Event =====
    public EventResponse getEvent(Integer id, String username) {
        Event event = eventRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));
        User student = (username != null) ? userRepository.findByUsername(username).orElse(null) : null;
        return toEventResponse(event, student);
    }

    // ===== CLUB: Get Event Members =====
    public List<RegistrationResponse> getEventRegistrations(Integer id, String username) {
        Event event = getEventOwnedByClubUser(id, username);
        return registrationRepository.findRegisteredByEvent(event).stream()
                .map(this::toRegistrationResponse)
                .collect(Collectors.toList());
    }

    // ===== Helpers =====
    private Event getEventOwnedByClubUser(Integer eventId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Club club = clubRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy CLB của bạn"));
        Event event = eventRepository.findByIdWithDetails(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));
        if (!event.getClub().getIdClub().equals(club.getIdClub()))
            throw new IllegalArgumentException("Bạn không có quyền thao tác sự kiện này");
        return event;
    }

    EventResponse toEventResponse(Event e, User student) {
        EventResponse r = new EventResponse();
        r.setIdEvent(e.getIdEvent());
        r.setNameEvent(e.getNameEvent());
        r.setDescription(e.getDescription());
        r.setImage(e.getImage());
        r.setStartDate(e.getStartDate());
        r.setEndDate(e.getEndDate());
        r.setLocation(e.getLocation());
        r.setRegistrationDeadline(e.getRegistrationDeadline());
        r.setMaxRegistration(e.getMaxRegistration());

        // Luôn đếm từ bảng registrations — nguồn sự thật duy nhất
        // Tránh mọi sai lệch do counter bị lệch (import data, lỗi cũ, v.v.)
        long countFromDB = registrationRepository.countRegisteredByEventId(e.getIdEvent());
        r.setNumberOfRegistration((int) countFromDB);

        r.setStatus(e.getStatus());
        r.setRejectionReason(e.getRejectionReason());
        r.setCreatedDate(e.getCreatedDate());
        r.setUpdatedDate(e.getUpdatedDate());

        if (e.getClub() != null) {
            r.setClubId(e.getClub().getIdClub());
            r.setClubName(e.getClub().getClubName());
            r.setClubShortName(e.getClub().getShortName());
        }
        if (e.getApprover() != null) {
            r.setApproverId(e.getApprover().getIdUser());
            r.setApproverName(e.getApprover().getFullName());
            r.setApprovedDate(e.getApprovedDate());
        }

        // Time status
        LocalDateTime now = LocalDateTime.now();
        if (e.getStartDate() != null && e.getEndDate() != null) {
            if (now.isBefore(e.getStartDate())) r.setTimeStatus("UPCOMING");
            else if (now.isAfter(e.getEndDate())) r.setTimeStatus("ENDED");
            else r.setTimeStatus("ONGOING");
        }

        // Is registered (for student)
        if (student != null) {
            r.setIsRegistered(registrationRepository.existsByEventAndStudentAndStatus(e, student, "REGISTERED"));
        } else {
            r.setIsRegistered(false);
        }
        return r;
    }

    private RegistrationResponse toRegistrationResponse(Registration reg) {
        RegistrationResponse r = new RegistrationResponse();
        r.setIdRegistration(reg.getIdRegistration());
        r.setRegistrationDate(reg.getRegistrationDate());
        r.setStatus(reg.getStatus());
        r.setCancelledDate(reg.getCancelledDate());
        if (reg.getEvent() != null) {
            r.setEventId(reg.getEvent().getIdEvent());
            r.setEventName(reg.getEvent().getNameEvent());
        }
        if (reg.getStudent() != null) {
            r.setStudentId(reg.getStudent().getIdUser());
            r.setStudentName(reg.getStudent().getFullName());
            r.setStudentCode(reg.getStudent().getStudentCode());
            r.setClassCode(reg.getStudent().getClassCode());
            r.setPhoneNumber(reg.getStudent().getPhoneNumber());
            r.setGender(reg.getStudent().getGender());
        }
        return r;
    }
}
