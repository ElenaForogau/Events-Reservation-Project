package com.project.EventsReservationProject.repository;

import com.project.EventsReservationProject.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookedEventBookingId(Long bookingId);
}
