import React, { useEffect, useState } from "react";
import { getAllEvents } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";

const EventCarousel = () => {
  const [events, setEvents] = useState([
    { id: "", eventType: "", eventPrice: "", photo: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllEvents()
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="mt-5">Loading events....</div>;
  }
  if (errorMessage) {
    return <div className=" text-danger mb-5 mt-5">Error : {errorMessage}</div>;
  }

  return (
    <section className="bg-light mb-5 mt-5 shadow">
      <Link to={"/browse-all-events"} className="hote-color text-center">
        Browse all event hall
      </Link>

      <Container>
        <Carousel indicators={false}>
          {[...Array(Math.ceil(events.length / 4))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row>
                {events.slice(index * 4, index * 4 + 4).map((event) => (
                  <Col key={event.id} className="mb-4" xs={12} md={6} lg={3}>
                    <Card>
                      <Link to={`/book-event/${event.id}`}>
                        <Card.Img
                          variant="top"
                          src={`data:image/png;base64, ${event.photo}`}
                          alt="Event Photo"
                          className="w-100"
                          style={{ height: "200px" }}
                        />
                      </Link>
                      <Card.Body>
                        <Card.Title className="hotel-color">
                          {event.eventType}
                        </Card.Title>
                        <Card.Title className="event-price">
                          ${event.eventPrice}/night
                        </Card.Title>
                        <div className="flex-shrink-0">
                          <Link
                            to={`/book-event/${event.id}`}
                            className="btn btn-hotel btn-sm"
                          >
                            Book Now
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default EventCarousel;
