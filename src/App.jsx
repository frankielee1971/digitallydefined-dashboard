import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import DigitalSuperpowerQuiz from "./pages/DigitalSuperpowerQuiz";
import AssistantPage from "./pages/AssistantPage";
import ChatWidget from "./components/ChatWidget";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";

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

      {/* Show chat ONLY on the main site */}
      {!isDashboardDomain && <ChatWidget />}

      <Routes>
        <Route path="/" element={homePage} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz" element={<DigitalSuperpowerQuiz />} />

        {/* ⭐ NEW: AI Assistant Page (dashboard only) */}
        {isDashboardDomain && (
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            }
          />
        )}

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