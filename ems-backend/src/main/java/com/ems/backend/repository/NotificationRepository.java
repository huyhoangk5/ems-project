package com.ems.backend.repository;

import com.ems.backend.entity.Notification;
import com.ems.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.createdDate DESC")
    List<Notification> findByUserOrderByCreatedDateDesc(@Param("user") User user);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    long countByUserAndIsReadFalse(@Param("user") User user);

    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = false")
    List<Notification> findByUserAndIsReadFalse(@Param("user") User user);
}
