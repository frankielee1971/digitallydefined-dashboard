import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import DashboardPage from "./pages/DashboardPage";
import NewsletterSignup from "./components/NewsletterSignup";
import "./styles/newsletter.css";

function App() {
  return (
    <>
      <SpeedInsights />

      <section className="dd-signup-wrapper">
        <div className="dd-signup-container">
          <h2 className="dd-signup-title">Become DigitallyDefined</h2>
          <p className="dd-signup-subtitle">
            Join thousands of Gen X women building digital freedom, passive
            income, and modern independence.
          </p>
          <NewsletterSignup />
        </div>
      </section>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
