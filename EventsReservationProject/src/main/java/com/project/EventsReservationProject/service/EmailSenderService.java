package com.project.EventsReservationProject.service;

import com.project.EventsReservationProject.model.BookedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendReservationEmail(BookedEvent bookedEvent) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@eventhallbooker.com");
        message.setTo(bookedEvent.getGuestEmail());
        message.setSubject("Confirmare Rezervare EventHallBooker");
        message.setText(buildEmailContent(bookedEvent));
        mailSender.send(message);
    }

    private String buildEmailContent(BookedEvent bookedEvent) {
        return "Dragă " + bookedEvent.getGuestFullName() + ",\n\n" +
                "Ai rezervat cu succes evenimentul: " + bookedEvent.getEvent()+ "\n" +
                "Pretul: " + bookedEvent.getEvent().getEventPrice() + "\n" +
                "Codul tău de confirmare este: " + bookedEvent.getBookingConfirmationCode() + "\n\n" +
                "Mulțumim,\nEventHallBooker Team";
    }

}
