import React, { useState } from "react";
import "../style/Stylemark.css"; // Make sure to create and style the Navbar.css file

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      {/* Left side with rounded logo */}
      <div className="navbar-logo">
        <img
          src="https://via.placeholder.com/50" // Replace with your logo URL
          alt="Logo"
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
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Requst</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  );
};

export default Navbar;
