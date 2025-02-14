import React, { useEffect, useState } from "react";
import { getEventById, updateEvent } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";

const EditEvent = () => {
  const [event, setEvent] = useState({
    photo: "",
    eventType: "",
    eventPrice: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { eventId } = useParams();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setEvent({ ...event, photo: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEvent({ ...event, [name]: value });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        setImagePreview(eventData.photo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateEvent(eventId, event);
      if (response.status === 200) {
        setSuccessMessage("Event Hall updated successfully!");
        const updatedEventData = await getEventById(eventId);
        setEvent(updatedEventData);
        setImagePreview(updatedEventData.photo);
        setErrorMessage("");
      } else {
        setErrorMessage("Error updating event hall");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-center mb-5 mt-5">Edit Event</h3>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="eventType" className="form-label hotel-color">
                Event Type
              </label>
              <input
                type="text"
                className="form-control"
                id="eventType"
                name="eventType"
                value={event.eventType}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="eventPrice" className="form-label hotel-color">
                Event Price
              </label>
              <input
                type="number"
                className="form-control"
                id="eventPrice"
                name="eventPrice"
                value={event.eventPrice}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="photo" className="form-label hotel-color">
                Photo
              </label>
              <input
                required
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={`data:image/jpeg;base64,${imagePreview}`}
                  alt="Event preview"
                  style={{ maxWidth: "400px", maxHeight: "400" }}
                  className="mt-3"
                />
              )}
            </div>
            <div className="d-grid gap-2 d-md-flex mt-2">
              <Link
                to={"/existing-events"}
                className="btn btn-outline-info ml-5"
              >
                back
              </Link>
              <button type="submit" className="btn btn-outline-warning">
                Edit Event Hall
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditEvent;
