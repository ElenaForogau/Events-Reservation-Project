package com.project.EventsReservationProject.controller;

import com.project.EventsReservationProject.model.BookedEvent;
import com.project.EventsReservationProject.model.Review;
import com.project.EventsReservationProject.service.BookedEventService;
import com.project.EventsReservationProject.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final BookedEventService bookedEventService;

    @PostMapping
    public ResponseEntity<Review> submitReview(@RequestBody Review review) {
        if (review.getBookedEvent() == null || review.getBookedEvent().getBookingId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        BookedEvent bookedEvent = bookedEventService.getReservationById(review.getBookedEvent().getBookingId());
        if (bookedEvent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        review.setBookedEvent(bookedEvent);
        Review savedReview = reviewService.saveReview(review);
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Review>> getReviewsByBookingId(@PathVariable Long bookingId) {
        List<Review> reviews = reviewService.getReviewsByBookingId(bookingId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
}
