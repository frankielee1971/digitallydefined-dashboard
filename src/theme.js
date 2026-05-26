import CONFIG from "./config";

const tokens = CONFIG.aesthetic.tokens;
const tokenColors = tokens.colors;

export const theme = {
  philosophy: CONFIG.aesthetic.philosophy,
  fonts: {
    heading: `'${tokens.typography.headings.font}', system-ui, sans-serif`,
    body: `'${tokens.typography.body.font}', system-ui, sans-serif`,
    app: `'${tokens.typography.headings.font}', '${tokens.typography.body.font}', system-ui, sans-serif`,
  },
  colors: {
    background: tokenColors.background,
    panel: CONFIG.colors.panel,
    card: tokenColors.card,
    textPrimary: tokenColors.text.primary,
    textDark: tokenColors.text.dark,
    border: tokens.geometry.borderColor,
    orange: tokenColors.accents.orange,
    aquaBlue: tokenColors.accents.aquaBlue,
    darkRed: tokenColors.accents.darkRed,
    muted: CONFIG.colors.textMuted,
  },
  geometry: {
    ...tokens.geometry,
    borderWidth: "1px",
    borderColor: "#111111",
    borderRadius: 0,
    shadows: tokens.geometry.shadows,
  },
  layout: tokens.layout,
};

export const brutalBorder = `${theme.geometry.borderWidth} solid ${theme.geometry.borderColor}`;

export const brutalCard = {
  border: brutalBorder,
  borderRadius: theme.geometry.borderRadius,
  boxShadow: theme.geometry.shadows,
  backgroundColor: theme.colors.panel,
};

export const brutalHeading = {
  fontFamily: theme.fonts.heading,
  fontWeight: tokens.typography.headings.weight || 800,
  fontStyle: "normal",
  textTransform: "none",
  letterSpacing: tokens.typography.headings.letterSpacing,
  color: theme.colors.textPrimary,
};

export const brutalEyebrow = {
  fontFamily: theme.fonts.heading,
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  margin: 0,
  color: theme.colors.textPrimary,
};

export const brutalButtonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  padding: "14px 20px",
  border: brutalBorder,
  borderRadius: theme.geometry.borderRadius,
  boxShadow: theme.geometry.shadows,
  textDecoration: "none",
  textTransform: "none",
  letterSpacing: "-0.01em",
  fontWeight: 700,
  fontSize: "0.85rem",
  cursor: "pointer",
  fontFamily: theme.fonts.body,
};

export const brutalButtonPrimary = {
  ...brutalButtonBase,
  backgroundColor: theme.colors.orange,
  color: theme.colors.textDark,
};

export const brutalButtonSecondary = {
  ...brutalButtonBase,
  backgroundColor: theme.colors.aquaBlue,
  color: theme.colors.textDark,
};
