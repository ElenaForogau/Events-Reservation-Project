package com.project.EventsReservationProject.repository;

import com.project.EventsReservationProject.model.BookedEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface BookedEventRepository extends JpaRepository<BookedEvent, Long> {

        List<BookedEvent> findByEventId(Long eventId);

        Optional<BookedEvent> findByBookingConfirmationCode(String confirmationCode);

        List<BookedEvent> findByGuestEmail(String email);
}
