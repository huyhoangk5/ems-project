package com.ems.backend.controller;

import com.ems.backend.dto.ApiResponse;
import com.ems.backend.dto.EventResponse;
import com.ems.backend.repository.ClubRepository;
import com.ems.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events/public")
@RequiredArgsConstructor
public class PublicController {

    private final EventService eventService;
    private final ClubRepository clubRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getApprovedEvents(
            @RequestParam(required = false) Integer clubId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(
                eventService.getApprovedEvents(null, clubId, startDate, endDate, keyword)));
    }

    @GetMapping("/clubs")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getClubs() {
        List<Map<String, Object>> clubs = clubRepository.findAll().stream()
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("idClub", c.getIdClub());
                    m.put("clubName", c.getClubName());
                    m.put("shortName", c.getShortName());
                    return m;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(clubs));
    }
}
