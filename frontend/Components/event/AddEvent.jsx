import React, { useState } from "react";
import { addEvent } from "../utils/ApiFunctions";
import EventTypeSelector from "../common/EventTypeSelector.jsx";
import { Link } from "react-router-dom";

const AddEvent = () => {
  const [newEvent, setNewEvent] = useState({
    photo: null,
    eventType: "",
    eventPrice: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleEventInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "eventPrice") {
      if (!isNaN(value)) {
        value = parseInt(value);
      } else {
        value = "";
      }
    }
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewEvent({ ...newEvent, photo: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await addEvent(
        newEvent.photo,
        newEvent.eventType,
        newEvent.eventPrice
      );
      if (success !== undefined) {
        setSuccessMessage("A new event hall was  added successfully !");
        setNewEvent({ photo: null, eventType: "", eventPrice: "" });
        setImagePreview("");
        setErrorMessage("");
      } else {
        setErrorMessage("Error adding new event hall");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  return (
    <>
      <section className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="mt-5 mb-2">Add a New Event Hall</h2>
            {successMessage && (
              <div className="alert alert-success fade show">
                {" "}
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger fade show">
                {" "}
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="eventType" className="form-label">
                  Event Type
                </label>
                <div>
                  <EventTypeSelector
                    handleEventInputChange={handleEventInputChange}
                    newEvent={newEvent}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="eventPrice" className="form-label">
                  Event Price
                </label>
                <input
                  required
                  type="number"
                  className="form-control"
                  id="eventPrice"
                  name="eventPrice"
                  value={newEvent.eventPrice}
                  onChange={handleEventInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="photo" className="form-label">
                  Event Photo
                </label>
                <input
                  required
                  name="photo"
                  id="id"
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview event photo"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    className="mb-3"
                  ></img>
                )}
              </div>
              <div className="d-grid gap-2 d-md-flex mt-2">
                <Link to={"/existing-events"} className="btn btn-outline-info">
                  Existing events hall
                </Link>
                <button type="submit" className="btn btn-outline-primary ml-5">
                  Save Event Hall
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddEvent;
