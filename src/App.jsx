import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import FreeRoiCalculator from "../FreeRoiCalculator";

const App = () => (
  <Routes>
    <Route path="/" element={<FreeRoiCalculator />} />
    <Route path="/landing" element={<FreeRoiCalculator />} />
    <Route path={CONFIG.routes.dashboard} element={<DashboardPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
