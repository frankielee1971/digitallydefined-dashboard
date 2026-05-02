import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";

const App = () => (
  <Routes>
    {/* Homepage now shows the REAL landing page */}
    <Route path="/" element={<LandingPage />} />

    {/* Dashboard */}
    <Route path={CONFIG.routes.dashboard} element={<DashboardPage />} />

    {/* Wildcard fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
