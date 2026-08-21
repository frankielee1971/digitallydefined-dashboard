import { theme, brutalBorder, brutalCard, brutalButtonPrimary, brutalButtonSecondary } from "../theme";

/* Shared DigitallyDefined brand tokens */
export const ddBrand = {
  tokens: {
    background: theme.colors.background,
    surface: theme.colors.surface,
    card: theme.colors.card,
    text: theme.colors.textPrimary,
    textMuted: theme.colors.muted,
    border: theme.colors.border,
    orange: theme.colors.orange,
    aquaBlue: theme.colors.aquaBlue,
    darkRed: theme.colors.darkRed,
    warning: "#F18B25",
    success: "#16A34A",
  },
  typography: {
    heading: theme.fonts.heading,
    body: theme.fonts.body,
    eyebrow: {
      fontFamily: theme.fonts.heading,
      fontSize: "0.72rem",
      fontWeight: 800,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      margin: 0,
      color: theme.colors.textPrimary,
    },
    headingBase: {
      fontFamily: theme.fonts.heading,
      fontWeight: 800,
      fontStyle: "normal",
      textTransform: "none",
      letterSpacing: "-0.03em",
      color: theme.colors.textPrimary,
      margin: 0,
    },
    bodyBase: {
      fontFamily: theme.fonts.body,
      fontSize: "1rem",
      lineHeight: "1.6",
      color: theme.colors.textPrimary,
      margin: 0,
    },
    muted: {
      fontFamily: theme.fonts.body,
      fontSize: "0.9rem",
      color: theme.colors.muted,
      margin: 0,
    },
  },
  card: {
    ...brutalCard,
    background: theme.colors.card,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  button: {
    primary: brutalButtonPrimary,
    secondary: brutalButtonSecondary,
  },
  border: brutalBorder,
};

export const ddSection = {
  padding: `clamp(44px, 7vw, 84px) clamp(24px, 4vw, 32px)`,
  background: ddBrand.tokens.background,
};

export const ddContainer = {
  maxWidth: "1100px",
  margin: "0 auto",
  width: "min(100% - 48px, 1100px)",
};

export const ddGrid = {
  display: "grid",
  gap: "24px",
};

export const ddStickyCta = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  zIndex: 999,
  background: ddBrand.tokens.orange,
  color: "#000000",
  border: ddBrand.border,
  padding: "14px 20px",
  fontFamily: ddBrand.typography.heading.fontFamily,
  fontWeight: 800,
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "transform 0.2s ease",
};
