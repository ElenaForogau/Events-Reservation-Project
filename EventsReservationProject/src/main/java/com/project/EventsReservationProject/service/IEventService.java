package com.project.EventsReservationProject.service;

import com.project.EventsReservationProject.model.Event;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
public interface IEventService {
    Event addNewEvent(MultipartFile photo, String eventType, BigDecimal eventPrice) throws SQLException, IOException;

    List<String> getAllEventType();

    List<Event> getAllEvents();

    byte[] getEventPhotoByEventId(Long eventId) throws SQLException;

    void deleteEvent(Long eventId);

    Event updateEvent(Long eventId, String eventType, BigDecimal eventPrice, byte[] photoBytes);

    Optional<Event> getEventById(Long eventId);

    List<Event> getAvailableEvents(LocalDate bookingDate, String eventType);
}
