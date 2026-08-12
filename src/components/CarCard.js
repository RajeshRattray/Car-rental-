import React from "react";
import { Link } from "react-router-dom";

const CarCard = ({ car, showAdmin, onEdit, onDelete }) => {
  console.log(car);
  
  const img = car.images && car.images.length > 0 ? car.images[0] : null;

  return (
    <div className="card car-card relative">
      <div className="car-card-img relative" style={{ position: "relative" }}>
        {img ? (
          <img src={"http://localhost:3000"+car.images[0]} alt={car.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg3)", fontSize: "4rem" }}>
            🚗
          </div>
        )}
        <span className={`car-card-badge ${car.isAvailable ? "badge-available" : "badge-unavailable"}`} style={{ position: "absolute", top: 12, right: 12 }}>
          {car.isAvailable ? "Available" : "Rented"}
        </span>
        <span className="type-badge" style={{ position: "absolute", top: 12, left: 12 }}>{car.type}</span>
      </div>
      <div className="card-body">
        <div className="flex-between mb-1">
          <h3 style={{ fontSize: "1.1rem", fontFamily: "Playfair Display, serif" }}>{car.brand} {car.model}</h3>
          <span style={{ color: "var(--text3)", fontSize: "0.8rem" }}>{car.year}</span>
        </div>
        <div className="car-specs-grid">
          <div className="car-spec">⚙️ {car.transmission}</div>
          <div className="car-spec">⛽ {car.fuel}</div>
          <div className="car-spec">💺 {car.seats} Seats</div>
          <div className="car-spec">📍 {car.location}</div>
        </div>
        <div className="divider" style={{ margin: "0.75rem 0" }} />
        <div className="flex-between">
          <div className="price">₹{car.pricePerDay.toLocaleString()} <span>/day</span></div>
          <div className="flex gap-1">
            {showAdmin ? (
              <>
                <button className="btn btn-outline btn-sm" onClick={() => onEdit(car)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(car._id)}>Delete</button>
              </>
            ) : (
              <Link to={`/cars/${car._id}`} className="btn btn-gold btn-sm">Book Now</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
