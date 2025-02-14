import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import ExistingEvents from "./Components/event/ExistingEvents.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/home/Home.jsx";
import EditEvent from "./Components/event/EditEvent.jsx";
import AddEvent from "./Components/event/AddEvent.jsx";
import NavBar from "./Components/layout/NavBar";
import Footer from "./Components/layout/Footer";
import EventListing from "./Components/event/EventListing.jsx";
import Admin from "./Components/admin/Admin";
import Checkout from "./Components/booking/Checkout";
import BookingSuccess from "./Components/booking/BookingSuccess";
import Bookings from "./Components/booking/Bookings";
import FindBooking from "./Components/booking/FindBooking";
import Login from "./Components/auth/Login";
import Registration from "./Components/auth/Registration";
import Profile from "./Components/auth/Profile";
import { AuthProvider } from "./Components/auth/AuthProvider";
import RequireAuth from "./Components/auth/RequireAuth";
import ConfirmAcc from "./Components/auth/ConfirmAcc.jsx";
import Chat from "./Components/chat/Chat.jsx";
import AdminAuditView from "./Components/auth/AdminAuditView.jsx";
import BookingDetailsPage from "./Components/review/BookingDetailsPage.jsx";

function App() {
  return (
    <AuthProvider>
      <main>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/confirm-account?token=" element={<ConfirmAcc />} />
            <Route path="/edit-event/:eventId" element={<EditEvent />} />
            <Route path="/existing-events" element={<ExistingEvents />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/chat" element={<Chat />} />
            <Route
              path="/booking-details/:bookingId"
              element={<BookingDetailsPage />}
            />
            <Route
              path="/book-event/:eventId"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route path="/browse-all-events" element={<EventListing />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/existing-bookings" element={<Bookings />} />
            <Route path="/find-booking" element={<FindBooking />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<FindBooking />} />
            <Route path="/view" element={<AdminAuditView />} />
          </Routes>
        </Router>
        <Footer />
      </main>
    </AuthProvider>
  );
}

export default App;
