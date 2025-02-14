import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192",
});

export const getHeader = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export async function addEvent(photo, eventType, eventPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("eventType", eventType);
  formData.append("eventPrice", eventPrice);

  const response = await api.post("/events/add/new-event", formData, {
    headers: getHeader(true),
  });
  if (response.status === 201) {
    return true;
  } else {
    return false;
  }
}

export async function getEventTypes() {
  try {
    const response = await api.get("/events/event/types");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching event types");
  }
}
export async function getAllEvents() {
  try {
    const result = await api.get("/events/all-events");
    return result.data;
  } catch (error) {
    throw new Error("Error fetching events");
  }
}

export async function deleteEvent(eventId) {
  try {
    const result = await api.delete(`/events/delete/event/${eventId}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting event ${error.message}`);
  }
}

export async function updateEvent(eventId, eventData) {
  const formData = new FormData();
  formData.append("eventType", eventData.eventType);
  formData.append("eventPrice", eventData.eventPrice);
  formData.append("photo", eventData.photo);
  const response = await api.put(`/events/update/${eventId}`, formData, {
    headers: getHeader(),
  });
  return response;
}

export async function getEventById(eventId) {
  try {
    const result = await api.get(`/events/event/${eventId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching event ${error.message}`);
  }
}

export async function bookEvent(eventId, booking) {
  try {
    const response = await api.post(
      `/bookings/event/${eventId}/booking`,
      booking
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking event : ${error.message}`);
    }
  }
}

export async function getAllBookings() {
  try {
    const result = await api.get("/bookings/all-bookings", {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.message}`);
  }
}

export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error find booking : ${error.message}`);
    }
  }
}

export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`);
    return result.data;
  } catch (error) {
    throw new Error(`Error cancelling booking :${error.message}`);
  }
}

export async function getAvailableEvents(checkInDate, checkOutDate, eventType) {
  const result = await api.get(
    `events/available-events?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&eventType=${eventType}`
  );
  return result;
}

export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    if (error.reeponse && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error : ${error.message}`);
    }
  }
}

export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserProfile(userId, token) {
  try {
    const response = await api.get(`users/profile/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

export async function getUser(userId, token) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getBookingsByUserId(userId, token) {
  try {
    const response = await api.get(`/bookings/user/${userId}/bookings`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Failed to fetch bookings");
  }
}

export async function sendConfirmationEmail(booking) {
  try {
    const response = await api.post("/send-confirmation-email", booking, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error sending email");
    } else {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}

export async function getAuditEvents() {
  try {
    const response = await api.get("/admin/audit-events", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching audit events: ${error.message}`);
  }
}
