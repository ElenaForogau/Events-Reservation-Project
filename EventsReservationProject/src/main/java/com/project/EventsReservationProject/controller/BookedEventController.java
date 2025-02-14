package com.project.EventsReservationProject.controller;

import com.project.EventsReservationProject.exception.InvalidBookingRequestException;
import com.project.EventsReservationProject.exception.ResourceNotFoundException;
import com.project.EventsReservationProject.model.BookedEvent;
import com.project.EventsReservationProject.model.Event;
import com.project.EventsReservationProject.response.BookingResponse;
import com.project.EventsReservationProject.response.EventResponse;
import com.project.EventsReservationProject.service.IBookedEventService;
import com.project.EventsReservationProject.service.IEventService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookedEventController {
    private final IBookedEventService bookingService;
    private final IEventService eventService;

    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        List<BookedEvent> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedEvent booking : bookings){
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @PostMapping("/events/{eventId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long eventId,
                                         @RequestBody BookedEvent bookingRequest){
        try{
            String confirmationCode = bookingService.saveBooking(eventId, bookingRequest);
            return ResponseEntity.ok(
                    "Event booked successfully, Your booking confirmation code is :"+confirmationCode);

        }catch (InvalidBookingRequestException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode){
        try{
            BookedEvent booking = bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch (ResourceNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        List<BookedEvent> bookings = bookingService.getBookingsByUserEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedEvent booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancelBooking(@PathVariable Long bookingId){
        bookingService.cancelBooking(bookingId);
    }

    private BookingResponse getBookingResponse(BookedEvent booking) {
        Event theEvent = eventService.getEventById(booking.getEvent().getId()).get();
        EventResponse event = new EventResponse(
                theEvent.getId(),
                theEvent.getEventType(),
                theEvent.getEventPrice());
        return new BookingResponse(
                booking.getBookingId(), booking.getCheckInDate(),
                booking.getCheckOutDate(),booking.getGuestFullName(),
                booking.getGuestEmail(), booking.getNumOfAdults(),
                booking.getNumOfChildren(), booking.getTotalNumOfGuest(),
                booking.getBookingConfirmationCode(), event);
    }

    @GetMapping("/download-reservation")
    public ResponseEntity<String> downloadReservation(@RequestParam String reservationId) {
        try {
            BookedEvent booking = bookingService.getReservationById(Long.parseLong(reservationId));
            if (booking == null) {
                throw new ResourceNotFoundException("Booking not found with id: " + reservationId);
            }

            JAXBContext context = JAXBContext.newInstance(BookedEvent.class);
            Marshaller marshaller = context.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

            StringWriter sw = new StringWriter();
            marshaller.marshal(booking, sw);
            String xmlContent = sw.toString();

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=reservation_" + reservationId + ".xml");
            return new ResponseEntity<>(xmlContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
