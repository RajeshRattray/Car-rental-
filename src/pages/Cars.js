import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCars } from "../utils/api";
import CarCard from "../components/CarCard";

const CAR_TYPES = ["All", "Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Van", "Truck", "Luxury", "Electric", "Hybrid"];
const FUELS = ["All", "Petrol", "Diesel", "Electric", "Hybrid"];
const TRANSMISSIONS = ["All", "Automatic", "Manual"];

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "", fuel: "", transmission: "", minPrice: "", maxPrice: "", search: "" });
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "";
    setFilters((f) => ({ ...f, type }));
  }, [location.search]);

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.fuel) params.fuel = filters.fuel;
      if (filters.transmission) params.transmission = filters.transmission;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      const { data } = await getCars(params);
      setCars(data);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val === "All" ? "" : val }));

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span className="section-label">Our Fleet</span>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.2rem" }}>Browse Available Cars</h1>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Search</label>
            <input className="form-control" placeholder="Search by brand, model..." value={filters.search}
              onChange={(e) => handleFilter("search", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-control" value={filters.type || "All"} onChange={(e) => handleFilter("type", e.target.value)}>
              {CAR_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Fuel</label>
            <select className="form-control" value={filters.fuel || "All"} onChange={(e) => handleFilter("fuel", e.target.value)}>
              {FUELS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Transmission</label>
            <select className="form-control" value={filters.transmission || "All"} onChange={(e) => handleFilter("transmission", e.target.value)}>
              {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Min Price (₹/day)</label>
            <input className="form-control" type="number" placeholder="0" value={filters.minPrice}
              onChange={(e) => handleFilter("minPrice", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Price (₹/day)</label>
            <input className="form-control" type="number" placeholder="Any" value={filters.maxPrice}
              onChange={(e) => handleFilter("maxPrice", e.target.value)} />
          </div>
        </div>

        {/* Results */}
        <div style={{ color: "var(--text3)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          {loading ? "Loading..." : `${cars.length} car${cars.length !== 1 ? "s" : ""} found`}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : cars.length === 0 ? (
          <div className="empty">
            <div className="icon">🚗</div>
            <h3>No cars found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {cars.map((car) => <CarCard key={car._id} car={car}/>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
