import React, { useContext } from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <Col key={event.id} className="mb-4" xs={12}>
      <Card>
        <Card.Body className="d-flex flex-wrap align-items-center">
          <div className="flex-shrrink-0 mr-3 mb-3 mb-md-0">
            <Link to={`/book-event/${event.id}`}>
              <Card.Img
                variant="top"
                src={`data:image/png;base64, ${event.photo}`}
                alt="Event Photo"
                style={{ width: "100%", maxWidth: "200px", height: "auto" }}
              />
            </Link>
          </div>
          <div className="flex-grow-1 ml-3 px-5">
            <Card.Title className="hotel-color">{event.eventType}</Card.Title>
            <Card.Title className="event-price">
              {event.eventPrice} / night
            </Card.Title>
            <Card.Text>
              Some event hall information goes here for the guest to read
              through
            </Card.Text>
          </div>
          <div className="flex-shrink-0 mt-3">
            <Link to={`/book-event/${event.id}`} className="btn btn-hotel btn-sm">
              Book Now
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default EventCard;
