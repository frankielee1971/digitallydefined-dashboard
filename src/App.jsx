import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const hostname = window.location.hostname;
  const isDashboardDomain = hostname === "dashboard.digitallydefined.online";
  const homePage = isDashboardDomain ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <LandingPage />
  );

  return (
    <>
      <SpeedInsights />
      <Routes>
        <Route path="/" element={homePage} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="*"
          element={
            isDashboardDomain ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
