import React, { useEffect, useState } from "react";
import { getAuditEvents } from "../utils/ApiFunctions";
const AdminAuditView = () => {
  const [auditEvents, setAuditEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAuditEvents();
        setAuditEvents(data);
      } catch (error) {
        console.error("Error fetching audit events", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>User Activity</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Event</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {auditEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.userId}</td>
              <td>{event.eventType}</td>
              <td>{event.eventTimestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAuditView;
