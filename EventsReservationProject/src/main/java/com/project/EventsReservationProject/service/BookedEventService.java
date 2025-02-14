package com.project.EventsReservationProject.service;

import com.project.EventsReservationProject.exception.InvalidBookingRequestException;
import com.project.EventsReservationProject.exception.ResourceNotFoundException;
import com.project.EventsReservationProject.model.BookedEvent;
import com.project.EventsReservationProject.model.Event;
import com.project.EventsReservationProject.repository.BookedEventRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookedEventService implements IBookedEventService{
    private final BookedEventRepository bookingRepository;
    private final IEventService eventService;

    @Override
    public List<BookedEvent> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<BookedEvent> getBookingsByUserEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public List<BookedEvent> getAllBookingsByEventId(Long eventId) {
        return bookingRepository.findByEventId(eventId);
    }

    @Override
    public String saveBooking(Long eventId, BookedEvent bookingRequest) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }
        Event event = eventService.getEventById(eventId).get();
        List<BookedEvent> existingBookings = event.getBookings();
        boolean eventIsAvailable = eventIsAvailable(bookingRequest,existingBookings);
        if (eventIsAvailable){
            event.addBooking(bookingRequest);
            bookingRepository.save(bookingRequest);
        }else{
            throw  new InvalidBookingRequestException("Sorry, This event is not available for the selected dates;");
        }
        return bookingRequest.getBookingConfirmationCode();
    }


    @Override
    public BookedEvent findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with booking code :"+confirmationCode));

    }


    private boolean eventIsAvailable(BookedEvent bookingRequest, List<BookedEvent> existingBookings) {
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                );
    }
    @Override
    public BookedEvent getReservationById(Long id){
        return bookingRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Booking not found with id: " + id));
    }



}
