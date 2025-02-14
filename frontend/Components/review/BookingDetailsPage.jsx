import ReviewForm from "./ReviewForm";
import DisplayReviews from "./DisplayReviews";

const BookingDetailsPage = ({ bookingId }) => {
  return (
    <div>
      <ReviewForm bookingId={bookingId} />
      <DisplayReviews bookingId={bookingId} />
    </div>
  );
};

export default BookingDetailsPage;
