import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { getAvailableEvents } from "../utils/ApiFunctions";
import EventSearchResults from "./EventSearchResult";
import EventTypeSelector from "./EventTypeSelector";

const EventSearch = () => {
  const [searchQuery, setSearchQuery] = useState({
    checkInDate: "",
    checkOutDate: "",
    eventType: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [availableEvents, setAvailableEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const checkInMoment = moment(searchQuery.checkInDate);
    const checkOutMoment = moment(searchQuery.checkOutDate);
    if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
      setErrorMessage("Please enter valid dates");
      return;
    }
    if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
      setErrorMessage("Check-out date must be after check-in date");
      return;
    }
    setIsLoading(true);
    getAvailableEvents(
      searchQuery.checkInDate,
      searchQuery.checkOutDate,
      searchQuery.eventType
    )
      .then((response) => {
        setAvailableEvents(response.data);
        setTimeout(() => setIsLoading(false), 2000);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    const checkInDate = moment(searchQuery.checkInDate);
    const checkOutDate = moment(searchQuery.checkOutDate);
    if (checkInDate.isValid() && checkOutDate.isValid()) {
      setErrorMessage("");
    }
  };
  const handleClearSearch = () => {
    setSearchQuery({
      checkInDate: "",
      checkOutDate: "",
      eventType: "",
    });
    setAvailableEvents([]);
  };

  return (
    <>
      <Container className="shadow mt-n5 mb-5 py-5">
        <Form onSubmit={handleSearch}>
          <Row className="justify-content-center">
            <Col xs={12} md={3}>
              <Form.Group controlId="checkInDate">
                <Form.Label>Check-in Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkInDate"
                  value={searchQuery.checkInDate}
                  onChange={handleInputChange}
                  min={moment().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="checkOutDate">
                <Form.Label>Check-out Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOutDate"
                  value={searchQuery.checkOutDate}
                  onChange={handleInputChange}
                  min={moment().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="eventType">
                <Form.Label>Event Hall Type</Form.Label>
                <div className="d-flex">
                  <EventTypeSelector
                    handleEventInputChange={handleInputChange}
                    newEvent={searchQuery}
                  />
                  <Button variant="secondary" type="submit" className="ml-2">
                    Search
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {isLoading ? (
          <p className="mt-4">Finding availble events hall....</p>
        ) : availableEvents ? (
          <EventSearchResults
            results={availableEvents}
            onClearSearch={handleClearSearch}
          />
        ) : (
          <p className="mt-4">
            No events hall available for the selected dates and event type.
          </p>
        )}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </Container>
    </>
  );
};

export default EventSearch;
