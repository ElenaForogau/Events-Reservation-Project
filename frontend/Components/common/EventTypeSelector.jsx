import React, { useState, useEffect } from "react";
import { getEventTypes } from "../utils/ApiFunctions";

const EventTypeSelector = ({ handleEventInputChange, newEvent }) => {
  const [eventTypes, setEventTypes] = useState([""]);
  const [showNewEventTypeInput, setShowNewEventTypeInput] = useState(false);
  const [newEventType, setNewEventType] = useState("");

  useEffect(() => {
    getEventTypes().then((data) => {
      setEventTypes(data);
    });
  }, []);

  const handleNewEventTypeInputChange = (e) => {
    setNewEventType(e.target.value);
  };

  const handleAddNewEventType = () => {
    if (newEventType !== "") {
      setEventTypes([...eventTypes, newEventType]);
      setNewEventType("");
      setShowNewEventTypeInput(false);
    }
  };

  return (
    <>
      {eventTypes.length > 0 && (
        <div>
          <select
            required
            className="form-select"
            name="eventType"
            onChange={(e) => {
              if (e.target.value === "Add New") {
                setShowNewEventTypeInput(true);
              } else {
                handleEventInputChange(e);
              }
            }}
            value={newEvent.eventType}
          >
            <option value="">Select an event hall type</option>
            <option value={"Add New"}>Add New</option>
            {eventTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {showNewEventTypeInput && (
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter New Event Hall Type"
                  value={newEventType}
                  onChange={handleNewEventTypeInputChange}
                />
                <button
                  className="btn btn-hotel"
                  type="button"
                  onClick={handleAddNewEventType}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EventTypeSelector;
