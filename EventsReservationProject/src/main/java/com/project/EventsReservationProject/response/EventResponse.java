package com.project.EventsReservationProject.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class EventResponse {
    private Long id;
    private String eventType;
    private BigDecimal eventPrice;
    private boolean isBooked = false;
    private String photo;
    private List<BookingResponse>bookings;

    public EventResponse(Long id, String eventType, BigDecimal eventPrice) {
        this.id = id;
        this.eventType=eventType;
        this.eventPrice = eventPrice;
    }

    public EventResponse(Long id, String eventType, BigDecimal eventPrice,boolean isBooked, byte[] photoBytes , List<BookingResponse> bookings) {
        this.id = id;
        this.eventType=eventType;
        this.eventPrice = eventPrice;
        this.isBooked = isBooked;
        this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
        this.bookings = bookings;
    }

}
