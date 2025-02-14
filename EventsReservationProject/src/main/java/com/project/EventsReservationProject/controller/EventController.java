package com.project.EventsReservationProject.controller;


import com.project.EventsReservationProject.exception.PhotoRetrievalException;
import com.project.EventsReservationProject.exception.ResourceNotFoundException;
import com.project.EventsReservationProject.model.BookedEvent;
import com.project.EventsReservationProject.response.EventResponse;
import com.project.EventsReservationProject.response.BookingResponse;
import com.project.EventsReservationProject.service.IEventService;
import com.project.EventsReservationProject.service.BookedEventService;
import com.project.EventsReservationProject.model.Event;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/events")
public class EventController {
    private final IEventService eventService;
    private final BookedEventService bookedEventService;

    @PostMapping("/add/new-event")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EventResponse> addNewEvent(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("eventType") String eventType,
            @RequestParam("eventPrice") BigDecimal eventPrice) throws SQLException, IOException {
        Event savedEvent = eventService.addNewEvent(photo,eventType, eventPrice);
        EventResponse response = new EventResponse(savedEvent.getId(), savedEvent.getEventType(),
                savedEvent.getEventPrice());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/types")
    public List<String> getEventTypes() {
        return eventService.getAllEventType();
    }

    @GetMapping("/all-events")
    public ResponseEntity<List<EventResponse>> getAllEvents() throws SQLException {
        List<Event> events = eventService.getAllEvents();
        List<EventResponse> eventResponses = new ArrayList<>();
        for (Event event : events) {
            byte[] photoBytes = eventService.getEventPhotoByEventId(event.getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.encodeBase64String(photoBytes);
                EventResponse eventResponse = getEventResponse(event);
                eventResponse.setPhoto(base64Photo);
                eventResponses.add(eventResponse);
            }
        }
        return ResponseEntity.ok(eventResponses);
    }
    @DeleteMapping("/delete/event/{eventId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId){
        eventService.deleteEvent(eventId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update/{eventId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long eventId,
                                                   @RequestParam(required = false)  String eventType,
                                                   @RequestParam(required = false) BigDecimal eventPrice,
                                                   @RequestParam(required = false) MultipartFile photo) throws SQLException, IOException {
        byte[] photoBytes = photo != null && !photo.isEmpty() ?
                photo.getBytes() : eventService.getEventPhotoByEventId(eventId);
        Blob photoBlob = photoBytes != null && photoBytes.length >0 ? new SerialBlob(photoBytes): null;
        Event theEvent = eventService.updateEvent(eventId, eventType, eventPrice, photoBytes);
        theEvent.setPhoto(photoBlob);
        EventResponse eventResponse = getEventResponse(theEvent);
        return ResponseEntity.ok(eventResponse);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Optional<EventResponse>> getEventById(@PathVariable Long eventId){
        Optional<Event> theEvent = eventService.getEventById(eventId);
        return theEvent.map(event -> {
            EventResponse eventResponse = getEventResponse(event);
            return  ResponseEntity.ok(Optional.of(eventResponse));
        }).orElseThrow(() -> new ResourceNotFoundException("Event not found"));
    }

    @GetMapping("/available-events")
    public ResponseEntity<List<EventResponse>> getAvailableEvents(
            @RequestParam("bookingDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate bookingDate,
            @RequestParam("eventType") String eventType) throws SQLException {
        List<Event> availableEvents = eventService.getAvailableEvents(bookingDate, eventType);
        List<EventResponse> eventResponses = new ArrayList<>();
        for (Event event : availableEvents){
            byte[] photoBytes = eventService.getEventPhotoByEventId(event.getId());
            if (photoBytes != null && photoBytes.length > 0){
                String photoBase64 = Base64.encodeBase64String(photoBytes);
                EventResponse eventResponse = getEventResponse(event);
                eventResponse.setPhoto(photoBase64);
                eventResponses.add(eventResponse);
            }
        }
        if(eventResponses.isEmpty()){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(eventResponses);
        }
    }

    private EventResponse getEventResponse(Event event) {
        List<BookedEvent> bookings = getAllBookingsByEventId(event.getId());
        List<BookingResponse> bookingInfo = bookings
                .stream()
                .map(booking -> new BookingResponse(booking.getBookingId(),
                        booking.getCheckInDate(), booking.getCheckOutDate(), booking.getBookingConfirmationCode())).toList();
        byte[] photoBytes = null;
        Blob photoBlob = event.getPhoto();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoRetrievalException("Error retrieving photo");
            }
        }
        return new EventResponse(event.getId(),
                event.getEventType(), event.getEventPrice(),
                event.isBooked(), photoBytes, bookingInfo);
    }

    private List<BookedEvent> getAllBookingsByEventId(Long eventId) {
        return bookedEventService.getAllBookingsByEventId(eventId);

    }

}
