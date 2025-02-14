package com.project.EventsReservationProject.controller;

import com.project.EventsReservationProject.model.BookedEvent;
import com.project.EventsReservationProject.service.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class EmailController {

    @Autowired
    private EmailSenderService emailSenderService;

    @PostMapping("/send-confirmation-email")
    public String sendConfirmationEmail(@RequestBody BookedEvent bookedEvent) {
        try {
            emailSenderService.sendReservationEmail(bookedEvent);
            return "{\"success\": true}";
        } catch (Exception e) {
            return "{\"success\": false, \"message\": \"" + e.getMessage() + "\"}";
        }
    }
}

