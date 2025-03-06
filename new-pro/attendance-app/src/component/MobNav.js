import React, { useState } from "react";
import "../style/Stylemark.css"; // Ensure the CSS file is correctly linked

const MobNav = ({ profileImage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container mobnavbar"> <div className="navbarmob ">
    {/* Left side with dynamic profile image */}
    <div className="navbar-logo">
      <img
        src={profileImage || "http://bootdey.com/img/Content/avatar/avatar1.png"} // Fallback to default profile
        alt="Profile"
        className="logo"
      />
    </div>

    {/* Menu toggle button */}
    <div className="menu-icon" onClick={toggleMenu}>
      <span className="menu-bar"></span>
      <span className="menu-bar"></span>
      <span className="menu-bar"></span>
    </div>

    {/* Dropdown menu */}
    <div className={`menu-items ${isMenuOpen ? "open" : ""}`}>
      <a href="#">MarkAttendance</a>
      <a href="#">Update Profile</a>
      
    </div>
  </div></div>
   
  );
};

export default MobNav;
