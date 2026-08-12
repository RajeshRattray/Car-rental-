import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🚗 <span>Drive</span>Luxe
      </Link>
      <div className="navbar-links">
        <Link to="/" className={isActive("/")}>Home</Link>
        <Link to="/cars" className={isActive("/cars")}>Fleet</Link>
        {user && !isAdmin && (
          <Link to="/my-bookings" className={isActive("/my-bookings")}>My Bookings</Link>
        )}
        {isAdmin && (
          <Link to="/admin" className={isActive("/admin")} style={{ color: "var(--gold)" }}>
            Admin Panel
          </Link>
        )}
        {user ? (
          <>
            <span style={{ color: "var(--text3)", fontSize: "0.85rem" }}>
              Hi, {user.name.split(" ")[0]}
            </span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive("/login")}>Login</Link>
            <Link to="/register" className="btn btn-gold btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
