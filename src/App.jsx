import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import ComingSoon from "./pages/ComingSoon";

const App = () => (
  <Routes>
    {/* Homepage now shows ComingSoon */}
    <Route path="/" element={<ComingSoon />} />

    {/* Keep this so you can still access the old landing page manually */}
    <Route path="/landing" element={<LandingPage />} />

    {/* Coming Soon page still works at /coming-soon */}
    <Route path="/coming-soon" element={<ComingSoon />} />

    {/* Dashboard stays the same */}
    <Route path={CONFIG.routes.dashboard} element={<DashboardPage />} />

    {/* Wildcard fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;

