import React from "react";

const MainHeader = () => {
  return (
    <header className="header-banner">
      <div className="overlay"></div>
      <div className="animated-texts overlay-content">
        <h1>
          Welcome to <span className="hotel-color">EventHallBooker</span>
        </h1>
        <h4>Where Events Meet Perfection</h4>
      </div>
    </header>
  );
};

export default MainHeader;
