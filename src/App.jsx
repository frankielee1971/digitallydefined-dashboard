import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import ComingSoon from "./pages/comingsoon";

const App = () => (
  <Routes>
    <Route path={CONFIG.routes.landing} element={<LandingPage />} />
    <Route path={CONFIG.routes.dashboard} element={<DashboardPage />} />
    <Route path="/coming-soon" element={<ComingSoon />} />
    <Route path="*" element={<Navigate to={CONFIG.routes.landing} replace />} />
  </Routes>
);

export default App;

