import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getMyBookings, cancelBooking } from "../utils/api";
import { format } from "date-fns";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await getMyBookings();
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const statusBadge = (status) => <span className={`car-card-badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <span className="section-label">Dashboard</span>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", marginBottom: "2rem" }}>My Bookings</h1>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : bookings.length === 0 ? (
          <div className="empty">
            <div className="icon">📋</div>
            <h3>No bookings yet</h3>
            <p>You haven't made any bookings. Browse our fleet to get started!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {bookings.map((b) => (
              <div key={b._id} className="card card-body" style={{ padding: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "1.5rem", alignItems: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                    {b.car?.images?.[0] ? <img src={"http://localhost:3000"+b.car.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🚗"}
                  </div>
                  <div>
                    <div className="flex-between" style={{ marginBottom: "0.4rem" }}>
                      <h3 style={{ fontFamily: "Playfair Display, serif" }}>{b.car?.brand} {b.car?.model}</h3>
                      {statusBadge(b.status)}
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem", color: "var(--text2)", fontSize: "0.85rem", flexWrap: "wrap" }}>
                      <span>📅 {format(new Date(b.startDate), "MMM d, yyyy")} → {format(new Date(b.endDate), "MMM d, yyyy")}</span>
                      <span>🕐 {b.totalDays} day(s)</span>
                      <span>📍 {b.pickupLocation}</span>
                    </div>
                    {b.adminNote && (
                      <div style={{ marginTop: "0.5rem", padding: "0.5rem 0.75rem", background: "var(--bg3)", borderRadius: 6, fontSize: "0.82rem", color: "var(--text2)" }}>
                        💬 Admin: {b.adminNote}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="price" style={{ marginBottom: "0.5rem" }}>₹{b.totalPrice.toLocaleString()}</div>
                    {b.status === "pending" && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
