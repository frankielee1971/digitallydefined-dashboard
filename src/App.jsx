import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/landing" element={<LandingPage />} />
    <Route path={CONFIG.routes.dashboard} element={<DashboardPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;

