import React from "react";
import Logo from "./Logo";
import { brutalBorder, theme } from "../theme";

const Nav = ({ colors, containerStyle, buttonStyle, onDashboardClick, ctaLabel }) => (
  <nav
    style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      borderBottom: brutalBorder,
      backgroundColor: colors.surface,
      padding: `20px ${theme.layout.spacing}`,
    }}
  >
    <div
      style={{
        ...containerStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.layout.spacing,
        flexWrap: "wrap",
      }}
    >
      <Logo
        as="div"
        style={{
          fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
          letterSpacing: "-0.05em",
        }}
      />
      <button type="button" onClick={onDashboardClick} style={buttonStyle}>
        {ctaLabel}
      </button>
    </div>
  </nav>
);

export default Nav;
