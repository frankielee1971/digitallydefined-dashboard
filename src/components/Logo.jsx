import React from "react";
import CONFIG from "../config";

const Logo = ({ as: Component = "span", style = {}, className = "" }) => {
  const logoImage = String(CONFIG.brand.logoImage || "").trim();

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    color: CONFIG.colors.text,
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
        <span
          style={{
            fontWeight: 900,
            fontSize: "17px",
            letterSpacing: "0.06em",
            color: CONFIG.colors.text,
          }}
        >
          {CONFIG.brand.logoText}
        </span>
      )}
    </Component>
  );
};

export default Logo;
