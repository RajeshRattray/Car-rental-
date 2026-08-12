import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCarById, createBooking } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({
    startDate: "", endDate: "", pickupLocation: "", dropoffLocation: "", driverLicense: "", notes: "",
  });
  const [totalDays, setTotalDays] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await getCarById(id);
        setCar(data);
        setForm((f) => ({ ...f, pickupLocation: data.location, dropoffLocation: data.location }));
      } catch {
        toast.error("Car not found");
        navigate("/cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    if (form.startDate && form.endDate) {
      const diff = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24));
      setTotalDays(diff > 0 ? diff : 0);
    }
  }, [form.startDate, form.endDate]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to book a car"); return navigate("/login"); }
    if (!car.isAvailable) return toast.error("This car is currently not available");
    if (totalDays <= 0) return toast.error("Please select valid dates");
    setBooking(true);
    try {
      await createBooking({ carId: id, ...form });
      toast.success("Booking submitted! Awaiting admin approval.");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="page"><div className="loading"><div className="spinner" /></div></div>;
  if (!car) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1.5rem" }}>
          ← Back
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
          {/* Car Info */}
          <div>
            <div className="card" style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
              {car.images && car.images.length > 0 ? (
                <img src={"http://localhost:3000"+car.images[0]} alt={car.name} style={{ width: "100%", height: "360px", objectFit: "cover" }} />
              ) : (
                <div style={{ height: "360px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg3)", fontSize: "6rem" }}>🚗</div>
              )}
            </div>
            <div className="card card-body">
              <div className="flex-between mb-2">
                <div>
                  <span className="type-badge">{car.type}</span>
                  <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", marginTop: "0.5rem" }}>
                    {car.brand} {car.model}
                  </h1>
                  <p style={{ color: "var(--text2)" }}>{car.year} · {car.color}</p>
                </div>
                <div className="price" style={{ textAlign: "right" }}>
                  ₹{car.pricePerDay.toLocaleString()}
                  <span style={{ display: "block" }}>/day</span>
                </div>
              </div>
              <div className="divider" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  ["⚙️ Transmission", car.transmission],
                  ["⛽ Fuel", car.fuel],
                  ["💺 Seats", car.seats],
                  ["📍 Location", car.location],
                  ["🏷️ Plate", car.licensePlate],
                  ["📊 Rentals", car.totalRentals],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "var(--bg3)", borderRadius: 8, padding: "0.75rem" }}>
                    <div style={{ color: "var(--text3)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{label}</div>
                    <div style={{ fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>
              {car.description && (
                <>
                  <h3 style={{ marginBottom: "0.5rem" }}>About This Car</h3>
                  <p style={{ color: "var(--text2)", lineHeight: 1.7 }}>{car.description}</p>
                </>
              )}
              {car.features && car.features.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <h3 style={{ marginBottom: "0.75rem" }}>Features</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {car.features.map((f) => (
                      <span key={f} className="type-badge">✓ {f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="card card-body" style={{ position: "sticky", top: "90px" }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", marginBottom: "0.25rem" }}>Book This Car</h2>
            <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              {car.isAvailable ? "✅ Available for booking" : "❌ Currently unavailable"}
            </p>
            {car.isAvailable ? (
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label className="form-label">Pickup Date</label>
                  <input className="form-control" type="date" min={today} value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Return Date</label>
                  <input className="form-control" type="date" min={form.startDate || today} value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Pickup Location</label>
                  <input className="form-control" placeholder="Pickup location" value={form.pickupLocation}
                    onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Drop-off Location</label>
                  <input className="form-control" placeholder="Drop-off location" value={form.dropoffLocation}
                    onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Driver's License Number</label>
                  <input className="form-control" placeholder="DL-XXXXXXXXXX" value={form.driverLicense}
                    onChange={(e) => setForm({ ...form, driverLicense: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Requests (optional)</label>
                  <textarea className="form-control" rows="2" placeholder="Any special notes..." value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                {totalDays > 0 && (
                  <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
                    <div className="flex-between">
                      <span style={{ color: "var(--text2)" }}>{totalDays} day(s) × ₹{car.pricePerDay.toLocaleString()}</span>
                      <span className="price" style={{ fontSize: "1.2rem" }}>₹{(totalDays * car.pricePerDay).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <button className="btn btn-gold" style={{ width: "100%", padding: "0.85rem" }} disabled={booking}>
                  {booking ? "Submitting..." : "Request Booking"}
                </button>
                {!user && <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.8rem", marginTop: "0.75rem" }}>You must be logged in to book</p>}
              </form>
            ) : (
              <div className="empty"><div className="icon">⛔</div><p>This car is not available right now.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
