import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/bookings", label: "Bookings", icon: "📋" },
  { to: "/admin/cars", label: "Fleet", icon: "🚗" },
  { to: "/admin/users", label: "Users", icon: "👥" },
];

const AdminLayout = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading" style={{ minHeight: "100vh" }}><div className="spinner" /></div>;
  if (!user || !isAdmin) return <Navigate to="/login" />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ marginBottom: "1.5rem", padding: "0 0.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.75rem" }}>Admin Panel</div>
        </div>
        {links.map((l) => (
          <Link key={l.to} to={l.to}
            className={location.pathname === l.to ? "active" : ""}>
            <span>{l.icon}</span> {l.label}
          </Link>
        ))}
        <div className="divider" style={{ margin: "1.5rem 0" }} />
        <Link to="/">← Back to Site</Link>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
