import React, { useContext } from "react";
import MainHeader from "../layout/MainHeader";
import HotelService from "../common/HotelService";
import Parallax from "../common/Parallax";
import EventCarousel from "../common/EventCarousel.jsx";
import EventSearch from "../common/EventSearch.jsx";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
const Home = () => {
  const location = useLocation();

  const message = location.state && location.state.message;
  const currentUser = localStorage.getItem("userId");
  return (
    <section>
      {message && <p className="text-warning px-5">{message}</p>}
      {currentUser && (
        <h6 className="text-success text-center">
          {" "}
          You are logged-In as {currentUser}
        </h6>
      )}
      <MainHeader />
      <div className="container">
        <EventSearch />
        <EventCarousel />
        <Parallax />
        <EventCarousel />
        <HotelService />
        <Parallax />
        <EventCarousel />
      </div>
    </section>
  );
};

export default Home;
