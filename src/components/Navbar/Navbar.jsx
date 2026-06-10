import { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

import {
  FaHome,
  FaUsers,
  FaUserPlus,
  FaBook,
  FaMoneyBillWave,
  FaHistory,
  FaBars,
  FaTimes
} from "react-icons/fa";

function Navbar() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (

    <nav className="navbar">

      {/* ✅ Top Row */}
      <div className="navbar-top">

        {/* ✅ Logo */}
        <h2 className="logo">
          Digital Khata
        </h2>

        {/* ✅ Mobile Toggle */}
        <button
          className="menu-btn"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen
            ? <FaTimes />
            : <FaBars />}
        </button>

      </div>

      {/* ✅ Links */}
      <div
        className={`nav-links ${
          menuOpen ? "show-menu" : ""
        }`}
      >

        <NavLink
          to="/"
          end
          className="nav-item"
          onClick={closeMenu}
        >
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink
          to="/customers"
          className="nav-item"
          onClick={closeMenu}
        >
          <FaUsers />
          Customers
        </NavLink>

        <NavLink
          to="/add-customer"
          className="nav-item"
          onClick={closeMenu}
        >
          <FaUserPlus />
          Add Customer
        </NavLink>

        <NavLink
          to="/add-khata"
          className="nav-item"
          onClick={closeMenu}
        >
          <FaBook />
          Add Khata
        </NavLink>

        <NavLink
          to="/payments"
          className="nav-item"
          onClick={closeMenu}
        >
          <FaMoneyBillWave />
          Payments
        </NavLink>

        <NavLink
          to="/history"
          className="nav-item"
          onClick={closeMenu}
        >
          <FaHistory />
          History
        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;