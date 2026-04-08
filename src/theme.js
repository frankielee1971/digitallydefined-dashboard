import CONFIG from "./config";

const tokens = CONFIG.aesthetic.tokens;

export const theme = {
  philosophy: CONFIG.aesthetic.philosophy,
  fonts: {
    heading: `'${tokens.typography.headings.font}', system-ui, sans-serif`,
    body: `'${tokens.typography.body.font}', system-ui, sans-serif`,
    app: `'${tokens.typography.headings.font}', '${tokens.typography.body.font}', system-ui, sans-serif`,
  },
  colors: {
    background: tokens.colors.background,
    card: tokens.colors.card,
    textPrimary: tokens.colors.text.primary,
    textDark: tokens.colors.text.dark,
    orange: tokens.colors.accents.orange,
    aquaBlue: tokens.colors.accents.aquaBlue,
    darkRed: tokens.colors.accents.darkRed,
  },
  geometry: tokens.geometry,
  layout: tokens.layout,
};

export const brutalBorder = `${theme.geometry.borderWidth} solid ${theme.geometry.borderColor}`;

export const brutalCard = {
  border: brutalBorder,
  borderRadius: theme.geometry.borderRadius,
  boxShadow: theme.geometry.shadows,
  backgroundColor: theme.colors.card,
};

export const brutalHeading = {
  fontFamily: theme.fonts.heading,
  fontWeight: theme.geometry ? tokens.typography.headings.weight : 900,
  fontStyle: tokens.typography.headings.style,
  textTransform: tokens.typography.headings.transform,
  letterSpacing: tokens.typography.headings.letterSpacing,
};

export const brutalEyebrow = {
  fontFamily: theme.fonts.heading,
  fontSize: "0.72rem",
  fontWeight: 900,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  margin: 0,
};

export const brutalButtonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  padding: "16px 22px",
  border: brutalBorder,
  borderRadius: theme.geometry.borderRadius,
  boxShadow: theme.geometry.shadows,
  textDecoration: "none",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 700,
  fontSize: "0.78rem",
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
