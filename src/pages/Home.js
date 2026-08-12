import React from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "🛡️", title: "Fully Insured", desc: "Every rental comes with comprehensive insurance coverage for your peace of mind." },
  { icon: "🔑", title: "Easy Booking", desc: "Book in minutes. Choose your dates, pick your car, and you're ready to go." },
  { icon: "⚡", title: "Quick Approval", desc: "Our team reviews and approves bookings fast so you never wait long." },
  { icon: "🌟", title: "Premium Fleet", desc: "From compact city cars to luxury SUVs — a car for every occasion." },
];

const carTypes = ["Sedan", "SUV", "Luxury", "Electric", "Convertible", "Van"];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="section-label">Premium Car Rental</span>
          <h1>Drive the Car of<br /><span>Your Dreams</span></h1>
          <p>Experience luxury, comfort, and freedom with our hand-picked fleet. No hidden fees, just open roads.</p>
          <div className="flex-center gap-2">
            <Link to="/cars" className="btn btn-gold" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              Browse Fleet →
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[["500+", "Happy Customers"], ["50+", "Premium Cars"], ["10+", "Car Brands"], ["24/7", "Support"]].map(([num, label]) => (
              <div className="stat-card" key={label} style={{ borderRight: "1px solid var(--border)" }}>
                <div className="num">{num}</div>
                <div className="label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Types */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Fleet</span>
            <h2>Browse by Category</h2>
            <p>Whatever your style, we have the perfect car waiting for you</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {carTypes.map((type) => (
              <Link
                key={type}
                to={`/cars?type=${type}`}
                className="card"
                style={{ padding: "1.5rem 2.5rem", textAlign: "center", minWidth: 140, textDecoration: "none" }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {type === "Sedan" ? "🚗" : type === "SUV" ? "🚙" : type === "Luxury" ? "🏎️" : type === "Electric" ? "⚡" : type === "Convertible" ? "🚕" : "🚐"}
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{type}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2>The DriveLuxe Difference</h2>
          </div>
          <div className="grid grid-4">
            {features.map((f) => (
              <div className="card card-body" key={f.title} style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="card card-body" style={{ padding: "4rem 2rem", background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, var(--bg2) 100%)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <span className="section-label">Ready to Ride?</span>
            <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>Start Your Journey Today</h2>
            <p style={{ color: "var(--text2)", maxWidth: 480, margin: "0 auto 2rem" }}>Create your account in seconds and get access to our full fleet of premium vehicles.</p>
            <Link to="/register" className="btn btn-gold" style={{ padding: "0.9rem 2.5rem", fontSize: "1rem" }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "2rem", textAlign: "center" }}>
        <div className="navbar-brand" style={{ justifyContent: "center", marginBottom: "0.5rem" }}>
          🚗 <span>Drive</span>Luxe
        </div>
        <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>© 2026 DriveLuxe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
