package com.ems.backend.repository;

import com.ems.backend.entity.Club;
import com.ems.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query("SELECT e FROM Event e JOIN FETCH e.club c LEFT JOIN FETCH c.organization WHERE e.club = :club AND e.isDeleted = false ORDER BY e.createdDate DESC")
    List<Event> findByClubAndIsDeletedFalse(@Param("club") Club club);

    @Query("SELECT e FROM Event e JOIN FETCH e.club c LEFT JOIN FETCH c.organization LEFT JOIN FETCH e.approver WHERE e.isDeleted = false ORDER BY CASE e.status WHEN 'PENDING' THEN 0 ELSE 1 END ASC, e.createdDate DESC")
    List<Event> findByIsDeletedFalse();

    @Query("SELECT COUNT(e) FROM Event e WHERE e.status = :status AND e.isDeleted = false")
    long countByStatusAndIsDeletedFalse(@Param("status") String status);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.isDeleted = false")
    long countByIsDeletedFalse();

    @Query("SELECT e FROM Event e JOIN FETCH e.club c LEFT JOIN FETCH c.organization WHERE e.isDeleted = false AND e.status = 'APPROVED' " +
           "AND (:clubId IS NULL OR c.idClub = :clubId) " +
           "AND (:startDate IS NULL OR e.startDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.endDate <= :endDate) " +
           "AND (:keyword IS NULL OR LOWER(e.nameEvent) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY e.createdDate DESC")
    List<Event> findApprovedEventsWithFilters(
            @Param("clubId") Integer clubId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("keyword") String keyword
    );

    @Query("SELECT e FROM Event e JOIN FETCH e.club c LEFT JOIN FETCH c.organization LEFT JOIN FETCH e.approver WHERE e.idEvent = :id")
    Optional<Event> findByIdWithDetails(@Param("id") Integer id);

    /**
     * Atomic increment: tránh race condition read-then-write.
     * Đồng thời kiểm tra maxRegistration: chỉ tăng khi chưa đủ hoặc không giới hạn.
     * Trả về số dòng bị ảnh hưởng (1 = thành công, 0 = đã đủ slot).
     */
    @Modifying
    @Query(value = "UPDATE events SET numberOfRegistration = numberOfRegistration + 1 " +
                   "WHERE idEvent = :eventId " +
                   "AND isDeleted = 0 " +
                   "AND (maxRegistration IS NULL OR numberOfRegistration < maxRegistration)",
           nativeQuery = true)
    int incrementRegistrationCount(@Param("eventId") Integer eventId);

    /**
     * Atomic decrement: không bao giờ xuống dưới 0.
     */
    @Modifying
    @Query(value = "UPDATE events SET numberOfRegistration = GREATEST(0, numberOfRegistration - 1) " +
                   "WHERE idEvent = :eventId AND isDeleted = 0",
           nativeQuery = true)
    void decrementRegistrationCount(@Param("eventId") Integer eventId);

    /**
     * Recalculate numberOfRegistration cho 1 event từ COUNT thực tế.
     * Dùng khi cần đồng bộ lại (admin, sau bulk import, v.v.).
     */
    @Modifying
    @Query(value = "UPDATE events e " +
                   "SET e.numberOfRegistration = (" +
                   "  SELECT COUNT(*) FROM registrations r " +
                   "  WHERE r.idEvent = e.idEvent AND r.status = 'REGISTERED'" +
                   ") WHERE e.idEvent = :eventId",
           nativeQuery = true)
    void recalculateRegistrationCount(@Param("eventId") Integer eventId);
}
