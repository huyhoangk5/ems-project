package com.ems.backend.service;

import com.ems.backend.dto.RegistrationResponse;
import com.ems.backend.entity.*;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public RegistrationResponse register(Integer eventId, String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findByIdWithDetails(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));

        // Validate trạng thái sự kiện
        if (!"APPROVED".equals(event.getStatus()))
            throw new IllegalStateException("Sự kiện chưa được phê duyệt");

        // Validate hạn đăng ký
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(event.getRegistrationDeadline()))
            throw new IllegalStateException("Sự kiện đã hết hạn đăng ký.");

        // Validate chưa đăng ký
        if (registrationRepository.existsByEventAndStudentAndStatus(event, student, "REGISTERED"))
            throw new IllegalStateException("Bạn đã đăng ký sự kiện này.");

        // Atomic increment — tự kiểm tra maxRegistration trong SQL,
        // trả về 0 nếu đã đủ slot → không có race condition
        int affected = eventRepository.incrementRegistrationCount(eventId);
        if (affected == 0)
            throw new IllegalStateException("Sự kiện đã đủ số lượng đăng ký.");

        // Lưu bản ghi đăng ký
        Registration reg = Registration.builder()
                .event(event)
                .student(student)
                .registrationDate(now)
                .status("REGISTERED")
                .build();
        registrationRepository.save(reg);

        notificationService.send(student,
                "Đăng ký thành công",
                "Bạn đã đăng ký tham gia sự kiện \"" + event.getNameEvent() + "\".",
                "REGISTRATION");

        return toResponse(reg);
    }

    @Transactional
    public void cancel(Integer eventId, String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findByIdWithDetails(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));

        Registration reg = registrationRepository
                .findByEventAndStudentAndStatus(event, student, "REGISTERED")
                .orElseThrow(() -> new IllegalArgumentException("Bạn chưa đăng ký sự kiện này"));

        // Validate thời gian hủy: phải trước 24h
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(event.getStartDate().minusHours(24)))
            throw new IllegalStateException("Không thể hủy vì còn ít hơn 24 giờ trước khi sự kiện diễn ra.");

        // Cập nhật trạng thái đăng ký
        reg.setStatus("CANCELLED");
        reg.setCancelledDate(now);
        registrationRepository.save(reg);

        // Atomic decrement — không bao giờ xuống dưới 0, không có race condition
        eventRepository.decrementRegistrationCount(eventId);

        notificationService.send(student,
                "Đã hủy đăng ký",
                "Bạn đã hủy đăng ký sự kiện \"" + event.getNameEvent() + "\".",
                "CANCELLATION");
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations(String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return registrationRepository.findByStudentWithEvent(student).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private RegistrationResponse toResponse(Registration reg) {
        RegistrationResponse r = new RegistrationResponse();
        r.setIdRegistration(reg.getIdRegistration());
        r.setRegistrationDate(reg.getRegistrationDate());
        r.setStatus(reg.getStatus());
        r.setCancelledDate(reg.getCancelledDate());
        if (reg.getEvent() != null) {
            r.setEventId(reg.getEvent().getIdEvent());
            r.setEventName(reg.getEvent().getNameEvent());
            r.setEventLocation(reg.getEvent().getLocation());
            r.setEventStartDate(reg.getEvent().getStartDate());
            r.setEventEndDate(reg.getEvent().getEndDate());
            if (reg.getEvent().getClub() != null)
                r.setClubName(reg.getEvent().getClub().getClubName());
        }
        if (reg.getStudent() != null) {
            r.setStudentId(reg.getStudent().getIdUser());
            r.setStudentName(reg.getStudent().getFullName());
        }
        return r;
    }
}
