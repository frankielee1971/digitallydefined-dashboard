import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";

const hostname =
  typeof window !== "undefined" ? window.location.hostname : "";

const isDashboardHost =
  hostname === "dashboard.digitallydefined.online" ||
  hostname === "digitallydefined-reputation-dashboa-nine.vercel.app";

const App = () => (
  <Routes>
    <Route
      path="/"
      element={
        isDashboardHost ? (
          <Navigate to={CONFIG.routes.dashboard} replace />
        ) : (
          <LandingPage />
        )
      }
    />

    <Route path="/landing" element={<LandingPage />} />
    <Route path={CONFIG.routes.dashboard} element={<DashboardPage />} />

    {CONFIG.routes.dashboardAliases.map((route) => (
      <Route
        key={route}
        path={route}
        element={<Navigate to={CONFIG.routes.dashboard} replace />}
      />
    ))}

    <Route
      path="*"
      element={
        isDashboardHost ? (
          <Navigate to={CONFIG.routes.dashboard} replace />
        ) : (
          <Navigate to="/" replace />
        )
      }
    />
  </Routes>
);

export default App;