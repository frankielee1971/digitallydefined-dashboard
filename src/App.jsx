import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPageUnified";
import DigitalSuperpowerQuiz from "./pages/DigitalSuperpowerQuizUnified";
import AssistantPage from "./pages/AssistantPageUnified";
import ThankYouCalculatorPage from "./pages/ThankYouCalculatorPageUnified";
import IntelligencePage from "./pages/IntelligencePageUnified";
import ChatWidget from "./components/ChatWidget";
import ScrollProgress from "./components/ScrollProgress";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/LoginUnified";
import SignUp from "./pages/auth/SignUpUnified";

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
      <ScrollProgress />

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
        <Route path="/automations" element={<AssistantPage />} />
        <Route path="/thank-you-calculator" element={<ThankYouCalculatorPage />} />
        <Route path="/intelligence" element={<IntelligencePage />} />

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