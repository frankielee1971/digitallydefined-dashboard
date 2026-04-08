import React from "react";
import CONFIG from "../config";
import { theme } from "../theme";

const Logo = ({ as: Component = "span", style = {}, className = "" }) => {
  const logoImage = String(CONFIG.brand.logoImage || "").trim();

  const baseStyle = {
    display: "inline-flex",
    alignItems: "baseline",
    gap: 0,
    color: CONFIG.colors.text,
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "inherit",
    fontWeight: 900,
    fontStyle: "normal",
    letterSpacing: "-0.05em",
    textTransform: "uppercase",
  };

  return (
    <Component
      className={className}
      style={{ ...baseStyle, ...style }}
      aria-label={CONFIG.brand.fullName}
    >
      {logoImage ? (
        <img
          src={`/${logoImage}`}
          alt={CONFIG.brand.fullName}
          style={{ height: "36px", width: "auto", objectFit: "contain" }}
        />
      ) : (
        <>
          <span
            style={{
              fontWeight: 900,
              fontStyle: "normal",
              letterSpacing: "inherit",
              color: "#111111",
            }}
          >
            {CONFIG.brand.nameLight}
          </span>
          <span
            style={{
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: "inherit",
              color: CONFIG.colors.accent,
            }}
          >
            {CONFIG.brand.nameBold}
          </span>
        </>
      )}
    </Component>
  );
};

export default Logo;
