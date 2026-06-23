import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

import DashboardPage from "./pages/DashboardPage.jsx";
import DigitalSuperpowerQuiz from "./pages/Quiz.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quiz" element={<DigitalSuperpowerQuiz />} />
      </Routes>

      <SpeedInsights />
    </>
  );
}

export default App;
