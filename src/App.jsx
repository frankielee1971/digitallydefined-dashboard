import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

import DashboardPage from "./pages/DashboardPage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";
import AutomationsPage from "./pages/AutomationsPage.jsx";
import Quiz from "./pages/Quiz.jsx"; // Make sure this file exists

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/automations" element={<AutomationsPage />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>

      <SpeedInsights />
    </>
  );
}

export default App;
