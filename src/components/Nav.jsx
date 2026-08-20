import React from "react";
import Logo from "./Logo";
import { brutalBorder, containerWidth, spacingScale, theme } from "../theme";

const Nav = ({ colors, containerStyle, buttonStyle, onDashboardClick, ctaLabel }) => (
  <nav
    style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      borderBottom: brutalBorder,
      backgroundColor: colors.surface,
      padding: `${spacingScale.md} ${containerWidth}`,
    }}
  >
    <div
      style={{
        ...containerStyle,
        maxWidth: containerWidth,
        width: "100%",
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
          letterSpacing: "-0.03em", // brand heading spacing (was -0.05em)
        }}
      />
      <button type="button" onClick={onDashboardClick} style={buttonStyle}>
        {ctaLabel}
      </button>
    </div>
  </nav>
);

export default Nav;
