package com.project.EventsReservationProject.service;

import com.project.EventsReservationProject.model.Review;
import com.project.EventsReservationProject.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByBookingId(Long bookingId) {
        return reviewRepository.findByBookedEventBookingId(bookingId);
    }
}