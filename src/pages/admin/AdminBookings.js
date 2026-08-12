import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllBookings, updateBookingStatus } from "../../utils/api";
import { format } from "date-fns";

const STATUSES = ["All", "pending", "approved", "rejected", "completed", "cancelled"];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchBookings(); }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter && filter !== "All" ? { status: filter } : {};
      const { data } = await getAllBookings(params);
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    setProcessing(true);
    try {
      await updateBookingStatus(id, { status, adminNote });
      toast.success(`Booking ${status}`);
      setSelected(null);
      setAdminNote("");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setProcessing(false);
    }
  };

  const statusBadge = (s) => <span className={`car-card-badge badge-${s}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;

  return (
    <div>
      <span className="section-label">Admin</span>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem" }}>Booking Requests</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {STATUSES.map((s) => (
            <button key={s} className={`btn btn-sm ${filter === s || (filter === "" && s === "All") ? "btn-gold" : "btn-outline"}`}
              onClick={() => setFilter(s === "All" ? "" : s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="loading"><div className="spinner" /></div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Customer</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text3)" }}>No bookings found</td></tr>
              )}
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.car?.brand} {b.car?.model}</div>
                    <div style={{ color: "var(--text3)", fontSize: "0.78rem" }}>{b.car?.type}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.user?.name}</div>
                    <div style={{ color: "var(--text3)", fontSize: "0.78rem" }}>{b.user?.email}</div>
                  </td>
                  <td style={{ fontSize: "0.85rem" }}>
                    {format(new Date(b.startDate), "MMM d")} → {format(new Date(b.endDate), "MMM d, yyyy")}
                  </td>
                  <td>{b.totalDays}</td>
                  <td><span style={{ color: "var(--gold)", fontWeight: 600 }}>₹{b.totalPrice.toLocaleString()}</span></td>
                  <td>{b.status}</td>
                  <td>
                    {b.status === "pending" && (
                      <button className="btn btn-gold btn-sm" onClick={() => { setSelected(b); setAdminNote(""); }}>
                        Review
                      </button>
                    )}
                    {b.status === "approved" && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleStatus(b._id, "completed")}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "Playfair Display, serif" }}>Review Booking</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{selected.car?.brand} {selected.car?.model}</div>
                <div style={{ color: "var(--text2)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span>👤 {selected.user?.name} ({selected.user?.email})</span>
                  <span>📅 {format(new Date(selected.startDate), "MMM d, yyyy")} → {format(new Date(selected.endDate), "MMM d, yyyy")}</span>
                  <span>🕐 {selected.totalDays} day(s)</span>
                  <span>📍 {selected.pickupLocation} → {selected.dropoffLocation}</span>
                  <span>🪪 License: {selected.driverLicense}</span>
                  {selected.notes && <span>💬 Notes: {selected.notes}</span>}
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>💰 Total: ₹{selected.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Note (optional)</label>
                <textarea className="form-control" rows="2" placeholder="Note for the customer..." value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={() => handleStatus(selected._id, "rejected")} disabled={processing}>
                {processing ? "..." : "❌ Reject"}
              </button>
              <button className="btn btn-success" onClick={() => handleStatus(selected._id, "approved")} disabled={processing}>
                {processing ? "..." : "✅ Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
