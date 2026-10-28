package com.ems.backend.repository;

import com.ems.backend.entity.Club;
import com.ems.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Integer> {

    @Query("SELECT c FROM Club c JOIN FETCH c.organization JOIN FETCH c.user WHERE c.user = :user")
    Optional<Club> findByUser(@Param("user") User user);

    @Query("SELECT c FROM Club c JOIN FETCH c.organization JOIN FETCH c.user WHERE c.user.idUser = :userId")
    Optional<Club> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT c FROM Club c JOIN FETCH c.organization JOIN FETCH c.user ORDER BY c.clubName ASC")
    List<Club> findAll();
}
