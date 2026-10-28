package com.ems.backend.repository;

import com.ems.backend.entity.Event;
import com.ems.backend.entity.Registration;
import com.ems.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Integer> {

    Optional<Registration> findByEventAndStudentAndStatus(Event event, User student, String status);

    boolean existsByEventAndStudentAndStatus(Event event, User student, String status);

    @Query("SELECT r FROM Registration r JOIN FETCH r.event e JOIN FETCH e.club WHERE r.student = :student ORDER BY r.registrationDate DESC")
    List<Registration> findByStudentWithEvent(@Param("student") User student);

    @Query("SELECT r FROM Registration r JOIN FETCH r.student WHERE r.event = :event ORDER BY r.registrationDate ASC")
    List<Registration> findByEvent(@Param("event") Event event);

    @Query("SELECT r FROM Registration r JOIN FETCH r.student WHERE r.event = :event AND r.status = 'REGISTERED' ORDER BY r.registrationDate ASC")
    List<Registration> findRegisteredByEvent(@Param("event") Event event);

    /**
     * Đếm số bản ghi REGISTERED thực tế — nguồn sự thật duy nhất.
     */
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event = :event AND r.status = 'REGISTERED'")
    long countRegisteredByEvent(@Param("event") Event event);

    /**
     * Đếm theo eventId (dùng khi không có entity Event).
     */
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.idEvent = :eventId AND r.status = 'REGISTERED'")
    long countRegisteredByEventId(@Param("eventId") Integer eventId);
}
