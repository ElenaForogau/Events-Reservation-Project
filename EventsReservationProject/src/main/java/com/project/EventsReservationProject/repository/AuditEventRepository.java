package com.project.EventsReservationProject.repository;

import com.project.EventsReservationProject.model.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findAllByOrderByEventTimestampDesc();
}
