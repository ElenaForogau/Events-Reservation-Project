import React, { useEffect, useState } from "react";
import BookingForm from "../booking/BookingForm";
import {
  FaUtensils,
  FaWifi,
  FaTv,
  FaWineGlassAlt,
  FaParking,
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import { getEventById } from "../utils/ApiFunctions";
import EventCarousel from "../common/EventCarousel";

const Checkout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState({
    photo: "",
    eventType: "",
    eventPrice: "",
  });

  const { eventId } = useParams();

  useEffect(() => {
    setTimeout(() => {
      getEventById(eventId)
        .then((response) => {
          setEventInfo(response);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }, 1000);
  }, [eventId]);

  return (
    <div>
      <section className="container">
        <div className="row">
          <div className="col-md-4 mt-5 mb-5">
            {isLoading ? (
              <p>Loading event hall information...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="event-info">
                <img
                  src={`data:image/png;base64,${eventInfo.photo}`}
                  alt="Event photo"
                  style={{ width: "100%", height: "200px" }}
                />
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Event Hall Type:</th>
                      <td>{eventInfo.eventType}</td>
                    </tr>
                    <tr>
                      <th>Price per night:</th>
                      <td>${eventInfo.eventPrice}</td>
                    </tr>
                    <tr>
                      <th>Event Hall Service:</th>
                      <td>
                        <ul className="list-unstyled">
                          <li>
                            <FaWifi /> Wifi
                          </li>
                          <li>
                            <FaTv /> Video Proiector
                          </li>
                          <li>
                            <FaUtensils /> Menu
                          </li>
                          <li>
                            <FaWineGlassAlt /> Cocktail bar
                          </li>
                          <li>
                            <FaParking /> Parking Space
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>
      <div className="container">
        <EventCarousel />
      </div>
    </div>
  );
};
export default Checkout;
