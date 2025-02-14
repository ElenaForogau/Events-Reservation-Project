package com.project.EventsReservationProject.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.xml.bind.annotation.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor



@XmlRootElement(name = "bookedEvent")
@XmlAccessorType(XmlAccessType.FIELD)
public class BookedEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @XmlElement
    private Long bookingId;

    @Column(name = "check_in")
    @XmlElement
    private LocalDate checkInDate;

    @Column(name = "check_out")
    @XmlElement
    private LocalDate checkOutDate;
    @Column(name = "guest_fullName")
    @XmlElement
    private String guestFullName;
    @Column(name = "guest_email")
    @XmlElement
    private String guestEmail;
    @Column(name = "adults")
    @XmlElement
    private int NumOfAdults;

    @Column(name = "children")
    @XmlElement
    private int NumOfChildren;
    @Column(name = "total_guest")
    @XmlElement
    private int totalNumOfGuest;
    @Column(name = "confirmation_Code")
    @XmlElement
    private String bookingConfirmationCode;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;


    public void setBookingConfirmationCode(String bookingConfirmationCode) {
        this.bookingConfirmationCode = bookingConfirmationCode;
    }



}
