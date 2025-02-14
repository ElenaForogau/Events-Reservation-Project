import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayReviews = ({ bookingId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9192/reviews/booking/${bookingId}`
        );
        setReviews(response.data);
      } catch (error) {
        setError("Error fetching reviews: " + error.message);
      }
    };

    fetchReviews();
  }, [bookingId]);

  return (
    <div className="container mt-5">
      <h2>Reviews</h2>
      {error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <ul className="list-group">
          {reviews.map((review) => (
            <li key={review.id} className="list-group-item">
              <p>Rating: {review.rating}</p>
              <p>{review.review}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplayReviews;
