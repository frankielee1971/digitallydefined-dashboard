import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import NewsletterSignup from "./components/NewsletterSignup";
import "./styles/newsletter.css"; // make sure this path matches your structure

function App() {
  return (
    <>
      <SpeedInsights />

      {/* DigitallyDefined Signup Section */}
      <section className="dd-signup-wrapper">
        <div className="dd-signup-container">
          <h2 className="dd-signup-title">Become DigitallyDefined</h2>
          <p className="dd-signup-subtitle">
            Join thousands of Gen X women building digital freedom, passive income, and modern independence.
          </p>

          <NewsletterSignup />
        </div>
      </section>

      {/* Your existing routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        {/* Add your other routes here */}
      </Routes>
    </>
  );
}

export default App;

