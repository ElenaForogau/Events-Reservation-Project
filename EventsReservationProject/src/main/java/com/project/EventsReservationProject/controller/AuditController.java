package com.project.EventsReservationProject.controller;


import com.project.EventsReservationProject.model.AuditEvent;
import com.project.EventsReservationProject.repository.AuditEventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AuditController {
    private final AuditEventRepository auditEventRepository;

    public AuditController(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @GetMapping("/audit-events")
    public ResponseEntity<List<AuditEvent>> getAuditEvents() {
        return ResponseEntity.ok(auditEventRepository.findAllByOrderByEventTimestampDesc());
    }
}

