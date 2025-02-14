package com.project.EventsReservationProject.repository;

import com.project.EventsReservationProject.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event,Long> {
    @Query("SELECT DISTINCT r.eventType FROM Event r")
    List<String> findDistinctEventTypes();

    @Query(" SELECT e FROM Event e " +
            " WHERE e.eventType LIKE %:eventType% " +
            " AND e.id NOT IN (" +
            "  SELECT br.event.id FROM BookedEvent br " +
            "  WHERE ((br.checkInDate <= :checkOutDate) AND (br.checkOutDate >= :checkInDate))" +
            ")")

    List<Event> findAvailableEventsByDatesAndType(LocalDate bookingDate, String eventType);

}
