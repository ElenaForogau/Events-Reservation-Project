package com.project.EventsReservationProject.service;

import com.project.EventsReservationProject.model.BookedEvent;

import java.util.List;

public interface IBookedEventService {
    void cancelBooking(Long bookingId);

    List<BookedEvent> getAllBookingsByEventId(Long eventId);

    String saveBooking(Long eventId, BookedEvent bookingRequest);

    BookedEvent findByBookingConfirmationCode(String confirmationCode);

    List<BookedEvent> getAllBookings();

    List<BookedEvent> getBookingsByUserEmail(String email);
    BookedEvent getReservationById(Long id);
}
