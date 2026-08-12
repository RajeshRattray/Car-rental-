import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCars, createCar, updateCar, deleteCar } from "../../utils/api";

const TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Van", "Truck", "Luxury", "Electric", "Hybrid"];
const FUELS = ["Petrol", "Diesel", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Automatic", "Manual"];

const EMPTY_FORM = {
  name: "", brand: "", model: "", year: new Date().getFullYear(), type: "Sedan",
  pricePerDay: "", seats: 5, transmission: "Automatic", fuel: "Petrol",
  mileage: "", color: "", licensePlate: "", description: "", features: "",
  location: "Main Branch", isAvailable: true,
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const { data } = await getCars();
      setCars(data);
    } catch {
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setEditCar(null); setForm(EMPTY_FORM); setImages([]); setShowModal(true); };
  const openEdit = (car) => {
    setEditCar(car);
    setForm({ ...car, features: Array.isArray(car.features) ? car.features.join(", ") : "" });
    setImages([]);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null) formData.append(k, v); });
      images.forEach((img) => formData.append("images", img));

      if (editCar) {
        await updateCar(editCar._id, formData);
        toast.success("Car updated!");
      } else {
        await createCar(formData);
        toast.success("Car added!");
      }
      setShowModal(false);
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this car from the fleet?")) return;
    try {
      await deleteCar(id);
      toast.success("Car removed");
      fetchCars();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <span className="section-label">Admin</span>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem" }}>Manage Fleet</h1>
        </div>
        <button className="btn btn-gold" onClick={openAdd}>+ Add New Car</button>
      </div>

      {loading ? <div className="loading"><div className="spinner" /></div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Car</th><th>Type</th><th>Price/Day</th><th>Fuel</th><th>Seats</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text3)" }}>No cars in fleet yet. Add your first car!</td></tr>
              )}
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {car.images?.[0] ? <img src={"http://localhost:3000"+car.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🚗"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{car.brand} {car.model}</div>
                        <div style={{ color: "var(--text3)", fontSize: "0.78rem" }}>{car.year} · {car.licensePlate}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="type-badge">{car.type}</span></td>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>₹{car.pricePerDay.toLocaleString()}</td>
                  <td>{car.fuel}</td>
                  <td>{car.seats}</td>
                  <td>
                    <span className={`car-card-badge ${car.isAvailable ? "badge-available" : "badge-unavailable"}`}>
                      {car.isAvailable ? "Available" : "Rented"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(car)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Car Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "Playfair Display, serif" }}>{editCar ? "Edit Car" : "Add New Car"}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                {[
                  ["Brand *", "brand", "text", "Toyota"],
                  ["Model *", "model", "text", "Camry"],
                  ["Name *", "name", "text", "Toyota Camry"],
                  ["License Plate *", "licensePlate", "text", "MH-01-AB-1234"],
                  ["Year *", "year", "number", "2023"],
                  ["Price Per Day (₹) *", "pricePerDay", "number", "2000"],
                  ["Seats *", "seats", "number", "5"],
                  ["Color", "color", "text", "Black"],
                  ["Mileage", "mileage", "text", "15 km/l"],
                  ["Location", "location", "text", "Main Branch"],
                ].map(([label, key, type, ph]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-control" type={type} placeholder={ph} value={form[key]}
                      onChange={(e) => f(key, e.target.value)} required={label.includes("*")} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-control" value={form.type} onChange={(e) => f("type", e.target.value)}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fuel *</label>
                  <select className="form-control" value={form.fuel} onChange={(e) => f("fuel", e.target.value)}>
                    {FUELS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Transmission *</label>
                  <select className="form-control" value={form.transmission} onChange={(e) => f("transmission", e.target.value)}>
                    {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Available</label>
                  <select className="form-control" value={form.isAvailable} onChange={(e) => f("isAvailable", e.target.value === "true")}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Features (comma-separated)</label>
                  <input className="form-control" placeholder="GPS, Bluetooth, Sunroof, Heated Seats" value={form.features}
                    onChange={(e) => f("features", e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="3" placeholder="Brief description of the car..." value={form.description}
                    onChange={(e) => f("description", e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Car Images (max 5)</label>
                  <input className="form-control" type="file" accept="image/*" multiple
                    onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
                  {editCar?.images?.length > 0 && <p style={{ color: "var(--text3)", fontSize: "0.78rem", marginTop: "0.4rem" }}>Currently has {editCar.images.length} image(s). Upload new to replace.</p>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? "Saving..." : editCar ? "Update Car" : "Add Car"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;
