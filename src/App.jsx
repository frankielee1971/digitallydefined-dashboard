import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CONFIG from "./config";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AssistantPage from "./pages/AssistantPage";
import ChatWidget from "./components/ChatWidget";

const hostname = typeof window !== "undefined" ? window.location.hostname : "";

const isDashboardHost =
  hostname === "dashboard.digitallydefined.online" ||
  hostname === "digitallydefined-reputation-dashboa-nine.vercel.app";

const App = () => (
  <>
    <SpeedInsights />

    {/* Show chat ONLY on the main site */}
    {!isDashboardHost && <ChatWidget />}

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

      {isDashboardHost && (
        <Route path="/assistant" element={<AssistantPage />} />
      )}

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

    <Analytics />
  </>
);

export default App;
