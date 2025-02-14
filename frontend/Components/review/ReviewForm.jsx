import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ bookingId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!bookingId) {
      setError("Booking ID is not defined.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to submit a review.");
        return;
      }

      const response = await axios.post(
        "http://localhost:9192/reviews",
        {
          bookedEvent: { bookingId: bookingId },
          review: review,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Review submitted successfully!");
        setReview("");
        setRating(1);
      }
    } catch (error) {
      setError("Error submitting review: " + error.message);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setError(null);
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h2>Submit a Review</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <select
            id="rating"
            className="form-select"
            value={rating}
            onChange={handleRatingChange}
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="review" className="form-label">
            Review
          </label>
          <textarea
            id="review"
            className="form-control"
            value={review}
            onChange={handleReviewChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Review
        </button>
        {error && <div className="text-danger mt-3">{error}</div>}
        {successMessage && (
          <div className="text-success mt-3">{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
