package com.project.EventsReservationProject.service;

import com.project.EventsReservationProject.model.AuditEvent;
import com.project.EventsReservationProject.repository.AuditEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {
    @Autowired
    private AuditEventRepository auditLogRepository;

    public void logEvent(Long userId, String eventType) {
        AuditEvent log = new AuditEvent();
        log.setUserId(userId);
        log.setEventType(eventType);
        log.setEventTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
}
