import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import CONFIG from "../config";
import Logo from "../components/Logo";
import RoiCalculator from "../components/RoiCalculator";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalButtonSecondary,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";

const FullRoiCalculatorPage = () => {
  const navigate = useNavigate();
  const { colors, routes } = CONFIG;

  useEffect(() => {
    document.title = "DigitallyDefined | Full 10x ROI Calculator";
  }, []);

  const container = {
    maxWidth: theme.layout.containerMaxWidth,
    margin: "0 auto",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: theme.fonts.app,
      }}
    >
      <header
        style={{
          borderBottom: brutalBorder,
          backgroundColor: colors.surface,
          padding: `18px ${theme.layout.spacing}`,
        }}
      >
        <div
          style={{
            ...container,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Logo as="div" style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }} />
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" onClick={() => navigate(routes.landing)} style={brutalButtonSecondary}>
              <ArrowLeft size={16} /> Free calculator
            </button>
            <button type="button" onClick={() => navigate(routes.dashboard)} style={brutalButtonPrimary}>
              Dashboard <LayoutDashboard size={16} />
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: `clamp(44px, 7vw, 84px) clamp(${theme.layout.spacing}, 4vw, 32px)` }}>
        <div style={{ ...container, display: "grid", gap: "28px" }}>
          <div style={{ maxWidth: "800px", display: "grid", gap: "14px" }}>
            <p style={{ ...brutalEyebrow, color: colors.warning }}>
              Full 10x ROI calculator
            </p>
            <h1
              style={{
                ...brutalHeading,
                margin: 0,
                fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
                lineHeight: 0.94,
              }}
            >
              Validate the upside before you build the campaign.
            </h1>
            <p
              style={{
                margin: 0,
                color: colors.textMuted,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Add retention and reputation lift to the free snapshot, then use the
              annualized estimate to decide whether your next move deserves budget,
              automation, or a sharper visibility system.
            </p>
          </div>

          <RoiCalculator mode="full" />
        </div>
      </main>
    </div>
  );
};

export default FullRoiCalculatorPage;
