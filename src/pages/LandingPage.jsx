import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../config";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import {
  brutalButtonPrimary,
  brutalButtonSecondary,
  brutalCard,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";

const dashboardConfig = CONFIG.dashboard;

const LandingPage = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const { brand, colors, contact, landing, metrics, routes, seo } = CONFIG;

  useEffect(() => {
    document.title = seo.title;
    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", seo.description);
  }, [seo.description, seo.title]);

  const sectionPadding = `clamp(48px, 7vw, 80px) clamp(${theme.layout.spacing}, 4vw, 32px)`;
  const shell = {
    fontFamily: theme.fonts.app,
    backgroundColor: colors.background,
    color: colors.text,
    minHeight: "100vh",
  };
  const container = {
    maxWidth: theme.layout.containerMaxWidth,
    margin: "0 auto",
  };
  const sectionBase = {
    padding: sectionPadding,
  };
  const h1Style = {
    fontSize: "clamp(3rem, 8vw, 6.5rem)",
    lineHeight: 0.92,
    ...brutalHeading,
    margin: 0,
  };
  const h2Style = {
    fontSize: "clamp(2rem, 5vw, 4rem)",
    lineHeight: 0.95,
    ...brutalHeading,
    margin: 0,
  };
  const cardStyle = {
    ...brutalCard,
    padding: "28px",
    backgroundColor: colors.surface,
  };
  const darkCardStyle = {
    ...brutalCard,
    padding: "28px",
    backgroundColor: colors.featureSurface,
    color: colors.bone,
  };
  const eyebrowStyle = brutalEyebrow;
  const primaryButton = brutalButtonPrimary;
  const outlineButton = {
    ...brutalButtonSecondary,
    color: colors.textDark || colors.text,
  };

  const statusItems = [
    { label: landing.statusSystemHealth, value: metrics.systemHealth },
    { label: landing.statusSentiment, value: metrics.sentimentIndex },
    { label: landing.statusAssetValue, value: metrics.assetValue },
    { label: landing.statusCommunity, value: metrics.communityCount },
  ];

  const metricsStripItems = [
    { label: landing.metricsStrip.assetValue, value: metrics.assetValue },
    { label: landing.metricsStrip.systemHealth, value: metrics.systemHealth },
    { label: landing.metricsStrip.reviewConversionRate, value: metrics.reviewConversionRate },
    { label: landing.metricsStrip.sentimentIndex, value: metrics.sentimentIndex },
  ];

  return (
    <div style={shell}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}</style>

      <Nav
        colors={colors}
        containerStyle={container}
        buttonStyle={outlineButton}
        onDashboardClick={() => navigate(routes.dashboard)}
        ctaLabel={landing.navCta}
      />

      <section style={sectionBase}>
        <div style={{ ...container, display: "grid", gap: "32px" }}>
          <p style={{ ...eyebrowStyle, color: colors.textMuted }}>
            {`${dashboardConfig.headerEyebrowPrefix} ${brand.version}${landing.metaSeparator}${landing.heroAudience}`}
          </p>
          <div>
            <h1 style={h1Style}>{landing.heroTitleLineOne}</h1>
            <h1 style={{ ...h1Style, color: colors.accent }}>{landing.heroTitleLineTwo}</h1>
          </div>
          <p
            style={{
              maxWidth: "760px",
              fontSize: "clamp(1rem, 2.1vw, 1.3rem)",
              lineHeight: 1.55,
              margin: 0,
              color: colors.textMuted,
            }}
          >
            {landing.heroSubheadline}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href={contact.gumroadUrl} target="_blank" rel="noreferrer" style={primaryButton}>
              {landing.heroPrimaryCta}
            </a>
            <a href={`#${landing.howItWorksAnchor}`} style={outlineButton}>
              {landing.heroSecondaryCta}
            </a>
          </div>
          <div
            style={{
              ...cardStyle,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            {statusItems.map((item) => (
              <div key={item.label} style={{ display: "grid", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      backgroundColor: colors.primary,
                      animation: "pulse 1.6s infinite",
                    }}
                  />
                  <span style={{ ...eyebrowStyle, color: colors.textMuted }}>{item.label}</span>
                </div>
                <span
                  style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={sectionBase}>
        <div style={{ ...container, display: "grid", gap: "28px" }}>
          <p style={{ ...eyebrowStyle, color: colors.textMuted }}>{landing.realTalkEyebrow}</p>
          <div>
            <h2 style={h2Style}>{landing.realTalkTitleLineOne}</h2>
            <h2 style={{ ...h2Style, color: colors.primary }}>{landing.realTalkTitleLineTwo}</h2>
          </div>
          <p
            style={{
              maxWidth: "760px",
              margin: 0,
              color: colors.textMuted,
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            {landing.realTalkBody}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            {landing.realTalkProblems.map((problem) => (
              <article key={problem.icon} style={cardStyle}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    display: "grid",
                    placeItems: "center",
                    border: `1px solid ${colors.border}`,
                    marginBottom: "16px",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                  }}
                >
                  {problem.icon}
                </div>
                <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.6 }}>{problem.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id={landing.featuresAnchor} style={{ ...sectionBase, backgroundColor: colors.dark }}>
        <div style={{ ...container, display: "grid", gap: "28px" }}>
          <p style={{ ...eyebrowStyle, color: colors.primary }}>{landing.featuresEyebrow}</p>
          <div>
            <h2 style={{ ...h2Style, color: colors.bone }}>{landing.featuresTitleLineOne}</h2>
            <h2 style={{ ...h2Style, color: colors.accent }}>{landing.featuresTitleLineTwo}</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            {landing.features.map((feature) => {
              const toneColor = feature.tone === "primary" ? colors.primary : colors.accent;
              return (
                <article key={feature.title} style={darkCardStyle}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      border: `1px solid ${toneColor}`,
                      color: toneColor,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: "20px",
                    }}
                  >
                    {feature.tag}
                  </div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "1.25rem",
                      textTransform: "uppercase",
                      fontWeight: 800,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ margin: 0, lineHeight: 1.65, color: colors.boneMuted }}>
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: colors.primary, padding: "28px 32px" }}>
        <div
          style={{
            ...container,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "18px",
          }}
        >
          {metricsStripItems.map((item) => (
            <div key={item.label} style={{ display: "grid", gap: "8px" }}>
              <span style={{ ...eyebrowStyle, color: colors.dark }}>{item.label}</span>
              <span
                style={{
                  color: colors.dark,
                  fontWeight: 900,
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  textTransform: "uppercase",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionBase}>
        <div style={{ ...container, display: "grid", gap: "28px" }}>
          <p style={{ ...eyebrowStyle, color: colors.textMuted }}>{landing.audienceEyebrow}</p>
          <div>
            <h2 style={h2Style}>{landing.audienceTitleLineOne}</h2>
            <h2 style={{ ...h2Style, color: colors.accent }}>{landing.audienceTitleLineTwo}</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            {landing.audienceRoles.map((role) => (
              <article key={role.title} style={cardStyle}>
                <h3
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "1rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {role.title}
                </h3>
                <p style={{ margin: 0, lineHeight: 1.6, color: colors.textMuted }}>
                  {role.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id={landing.howItWorksAnchor} style={{ ...sectionBase, backgroundColor: colors.backgroundAlt }}>
        <div style={{ ...container, display: "grid", gap: "28px" }}>
          <p style={{ ...eyebrowStyle, color: colors.textMuted }}>{landing.howItWorksEyebrow}</p>
          <div>
            <h2 style={h2Style}>{landing.howItWorksTitleLineOne}</h2>
            <h2 style={{ ...h2Style, color: colors.primary }}>{landing.howItWorksTitleLineTwo}</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            {landing.steps.map((step) => (
              <article key={step.number} style={cardStyle}>
                <div
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 900,
                    color: colors.primary,
                    marginBottom: "18px",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ margin: 0, lineHeight: 1.65, color: colors.textMuted }}>
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...sectionBase, backgroundColor: colors.accent, textAlign: "center" }}>
        <div style={{ ...container, maxWidth: "900px" }}>
          <blockquote
            style={{
              margin: 0,
              fontSize: "clamp(1.8rem, 4vw, 3.4rem)",
              lineHeight: 1.25,
              fontStyle: "italic",
              fontWeight: 800,
              color: colors.bone,
            }}
          >
            {landing.manifestoQuote}
          </blockquote>
          <p
            style={{
              margin: "22px 0 0 0",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.72rem",
              fontWeight: 800,
              color: colors.bone,
            }}
          >
            {landing.manifestoAttribution}
          </p>
        </div>
      </section>

      <section style={{ ...sectionBase, backgroundColor: colors.dark, color: colors.bone }}>
        <div style={{ ...container, display: "grid", gap: "22px" }}>
          <p style={{ ...eyebrowStyle, color: colors.primary }}>{landing.finalCtaEyebrow}</p>
          <h2 style={{ ...h2Style, color: colors.bone }}>{landing.finalCtaTitle}</h2>
          <p
            style={{
              maxWidth: "760px",
              margin: 0,
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: colors.boneSoft,
            }}
          >
            {landing.finalCtaBody}
          </p>
          <div>
            <a href={contact.gumroadUrl} target="_blank" rel="noreferrer" style={primaryButton}>
              {landing.finalCtaButton}
            </a>
          </div>
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.72rem",
              color: colors.boneFaint,
            }}
          >
            {`${dashboardConfig.headerEyebrowPrefix} ${brand.version}${landing.metaSeparator}${landing.finalCtaSmallPrintSuffix}`}
          </p>
        </div>
      </section>

      <Footer
        colors={colors}
        containerStyle={container}
        footerStyle={sectionBase}
        navigate={navigate}
        routes={routes}
        landing={landing}
        contact={contact}
        year={year}
      />
    </div>
  );
};

export default LandingPage;
