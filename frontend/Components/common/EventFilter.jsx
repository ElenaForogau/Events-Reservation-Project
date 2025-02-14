import React, { useState } from "react";

const EventFilter = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState("");

  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setFilter(selectedType);

    const filteredEvents = data.filter((event) =>
      event.eventType.toLowerCase().includes(selectedType.toLowerCase())
    );
    setFilteredData(filteredEvents);
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
  };

  const eventTypes = ["", ...new Set(data.map((event) => event.eventType))];

  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="event-type-filter">
        FIlter event hall by type
      </span>
      <select
        className="form-select"
        aria-label="romm type filter"
        value={filter}
        onChange={handleSelectChange}
      >
        <option value="">select an event hall type to filter....</option>
        {eventTypes.map((type, index) => (
          <option key={index} value={String(type)}>
            {String(type)}
          </option>
        ))}
      </select>
      <button className="btn btn-hotel" type="button" onClick={clearFilter}>
        Clear Filter
      </button>
    </div>
  );
};
export default EventFilter;
