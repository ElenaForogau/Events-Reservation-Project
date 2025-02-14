package com.project.EventsReservationProject.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.apache.commons.lang3.RandomStringUtils;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;
import java.math.BigDecimal;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Entity
@XmlAccessorType(XmlAccessType.FIELD)

public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String eventType;
    private BigDecimal eventPrice;
    private boolean isBooked = false;
    @Lob
    @XmlTransient
    private Blob photo;
    @OneToMany(mappedBy="event", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedEvent> bookings;

    public Event() {
        this.bookings = new ArrayList<>();

    }
    public void addBooking(BookedEvent booking){
        if (bookings == null){
            bookings = new ArrayList<>();
        }
        bookings.add(booking);
        booking.setEvent(this);
        isBooked = true;
        String bookingCode = RandomStringUtils.randomNumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
    }


}
