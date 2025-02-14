import React, { useEffect, useState } from "react";
import { deleteEvent, getAllEvents } from "../utils/ApiFunctions";
import { Col, Row } from "react-bootstrap";
import EventFilter from "../common/EventFilter.jsx";
import EventPaginator from "../common/EventPaginator.jsx";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingEvents = () => {
  const [events, setEvents] = useState([{ id: "", eventType: "", eventPrice: "" }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([
    { id: "", eventType: "", eventPrice: "" },
  ]);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const result = await getAllEvents();
      setEvents(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventType === "") {
      setFilteredEvents(events);
    } else {
      const filteredEvents = events.filter(
        (event) => event.eventType === selectedEventType
      );
      setFilteredEvents(filteredEvents);
    }
    setCurrentPage(1);
  }, [events, selectedEventType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (eventId) => {
    try {
      const result = await deleteEvent(eventId);
      if (result === "") {
        setSuccessMessage(`Event No ${eventId} was delete`);
        fetchEvents();
      } else {
        console.error(`Error deleting event : ${result.message}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const calculateTotalPages = (filteredEvents, eventsPerPage, events) => {
    const totalEvents =
      filteredEvents.length > 0 ? filteredEvents.length : events.length;
    return Math.ceil(totalEvents / eventsPerPage);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <>
      <div className="container col-md-8 col-lg-6">
        {successMessage && (
          <p className="alert alert-success mt-5">{successMessage}</p>
        )}

        {errorMessage && (
          <p className="alert alert-danger mt-5">{errorMessage}</p>
        )}
      </div>

      {isLoading ? (
        <p>Loading existing events</p>
      ) : (
        <>
          <section className="mt-5 mb-5 container">
            <div className="d-flex justify-content-between mb-3 mt-5">
              <h2>Existing Events</h2>
            </div>

            <Row>
              <Col md={6} className="mb-2 md-mb-0">
                <EventFilter data={events} setFilteredData={setFilteredEvents} />
              </Col>

              <Col md={6} className="d-flex justify-content-end">
                <Link to={"/add-event"}>
                  <FaPlus /> Add Event
                </Link>
              </Col>
            </Row>

            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Event Hall Type</th>
                  <th>Event Hall Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentEvents.map((event) => (
                  <tr key={event.id} className="text-center">
                    <td>{event.id}</td>
                    <td>{event.eventType}</td>
                    <td>{event.eventPrice}</td>
                    <td className="gap-2">
                      <Link to={`/edit-event/${event.id}`} className="gap-2">
                        <span className="btn btn-info btn-sm">
                          <FaEye />
                        </span>
                        <span className="btn btn-warning btn-sm ml-5">
                          <FaEdit />
                        </span>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm ml-5"
                        onClick={() => handleDelete(event.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <EventPaginator
              currentPage={currentPage}
              totalPages={calculateTotalPages(
                filteredEvents,
                eventsPerPage,
                events
              )}
              onPageChange={handlePaginationClick}
            />
          </section>
        </>
      )}
    </>
  );
};

export default ExistingEvents;
