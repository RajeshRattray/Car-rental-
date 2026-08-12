import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Total Users", num: stats.totalUsers, icon: "👥", color: "#3498db" },
    { label: "Total Cars", num: stats.totalCars, icon: "🚗", color: "var(--gold)" },
    { label: "Total Bookings", num: stats.totalBookings, icon: "📋", color: "#9b59b6" },
    { label: "Pending Approvals", num: stats.pendingBookings, icon: "⏳", color: "#f39c12" },
    { label: "Active Rentals", num: stats.approvedBookings, icon: "✅", color: "#2ecc71" },
    { label: "Total Revenue", num: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: "💰", color: "#e74c3c" },
  ] : [];

  return (
    <div>
      <span className="section-label">Admin Panel</span>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", marginBottom: "2rem" }}>Dashboard</h1>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="grid grid-3" style={{ marginBottom: "2rem" }}>
            {cards.map((c) => (
              <div className="card card-body" key={c.label} style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: `${c.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: "1.75rem", fontFamily: "Playfair Display, serif", fontWeight: 700, color: c.color }}>{c.num}</div>
                  <div style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", marginBottom: "1rem" }}>Quick Actions</h2>
          <div className="grid grid-4">
            {[
              { to: "/admin/bookings", icon: "📋", title: "Manage Bookings", desc: "Review and approve booking requests" },
              { to: "/admin/cars", icon: "🚗", title: "Manage Fleet", desc: "Add, edit, or remove cars" },
              { to: "/admin/users", icon: "👥", title: "Manage Users", desc: "View and manage registered users" },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="card card-body" style={{ display: "block" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", marginBottom: "0.3rem" }}>{item.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "0.82rem" }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
