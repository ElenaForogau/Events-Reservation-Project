import React, { useEffect, useState } from "react";
import { getAllEvents } from "../utils/ApiFunctions";
import EventCard from "./EventCard";
import { Col, Container, Row } from "react-bootstrap";
import EventFilter from "../common/EventFilter.jsx";
import EventPaginator from "../common/EventPaginator.jsx";

const Event = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [filteredData, setFilteredData] = useState([{ id: "" }]);

  useEffect(() => {
    setIsLoading(true);
    getAllEvents()
      .then((data) => {
        setData(data);
        setFilteredData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);
  if (isLoading) {
    return <div>Loading events hall.....</div>;
  }
  if (error) {
    return <div className=" text-danger">Error : {error}</div>;
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredData.length / eventsPerPage);

  const renderEvents = () => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return filteredData
      .slice(startIndex, endIndex)
      .map((event) => <EventCard key={event.id} event={event} />);
  };

  return (
    <Container>
      <Row>
        <Col md={6} className="mb-3 mb-md-0">
          <EventFilter data={data} setFilteredData={setFilteredData} />
        </Col>

        <Col md={6} className="d-flex align-items-center justify-content-end">
          <EventPaginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>

      <Row>{renderEvents()}</Row>

      <Row>
        <Col md={6} className="d-flex align-items-center justify-content-end">
          <EventPaginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Event;
