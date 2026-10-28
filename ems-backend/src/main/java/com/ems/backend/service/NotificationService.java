package com.ems.backend.service;

import com.ems.backend.dto.NotificationResponse;
import com.ems.backend.entity.*;
import com.ems.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void send(User user, String title, String content, String type) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .content(content)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return notificationRepository.findByUserOrderByCreatedDateDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countUnread(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAllRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalse(user);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void markRead(Integer id, String username) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser().getUsername().equals(username)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    private NotificationResponse toResponse(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setIdNotification(n.getIdNotification());
        r.setTitle(n.getTitle());
        r.setContent(n.getContent());
        r.setType(n.getType());
        r.setCreatedDate(n.getCreatedDate());
        r.setIsRead(n.getIsRead());
        return r;
    }
}
