import React, { useEffect } from "react";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, Users } from "lucide-react";
import CONFIG from "../config";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import RoiCalculator from "../components/RoiCalculator";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalButtonSecondary,
  brutalCard,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";

const LandingPage = () => {
  const year = new Date().getFullYear();
  const { colors, contact, landing, routes, seo } = CONFIG;
  const fullCalculatorUrl = contact.fullCalculatorUrl || contact.gumroadUrl;

  useEffect(() => {
    document.title = "DigitallyDefined | Free 10x ROI Calculator";
    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      "Use the free DigitallyDefined 10x ROI Calculator to estimate how much revenue your digital property could be leaving on the table.",
    );
  }, [seo.description, seo.title]);

  const container = {
    maxWidth: theme.layout.containerMaxWidth,
    margin: "0 auto",
  };
  const section = {
    padding: `clamp(44px, 7vw, 84px) clamp(${theme.layout.spacing}, 4vw, 32px)`,
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
      <style>{`
        .dd-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.82fr);
          gap: clamp(28px, 5vw, 48px);
          align-items: center;
        }

        .dd-brand-hero {
          display: flex;
          flex-wrap: wrap;
          column-gap: 0;
          row-gap: 0;
        }

        .dd-proof-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        @media (max-width: 920px) {
          .dd-hero-grid,
          .dd-roi-calculator__top {
            grid-template-columns: 1fr !important;
          }

          .dd-roi-calculator__top > div:first-child {
            border-right: 0 !important;
            border-bottom: ${brutalBorder};
          }
        }

        @media (max-width: 720px) {
          .dd-proof-grid,
          .dd-roi-calculator__top div[style*="repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
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
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <Logo as="div" style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }} />
          <a
            href={fullCalculatorUrl}
            target="_blank"
            rel="noreferrer"
            style={brutalButtonSecondary}
          >
            Full calculator <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <main>
        <section style={section}>
          <div className="dd-hero-grid" style={container}>
            <div style={{ display: "grid", gap: "24px" }}>
              <p style={{ ...brutalEyebrow, color: colors.textMuted }}>
                Digital real estate yield engine / built for Gen X women
              </p>
              <div style={{ minWidth: 0 }}>
                <h1
                  className="dd-brand-hero"
                  style={{
                    ...brutalHeading,
                    margin: 0,
                    fontSize: "clamp(2.6rem, 5vw, 4rem)",
                    lineHeight: 0.98,
                    color: colors.text,
                  }}
                >
                  <span>Digitally</span>
                  <span style={{ color: colors.accent }}>Defined</span>
                </h1>
                <p
                  style={{
                    margin: "18px 0 0",
                    maxWidth: "680px",
                    fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                    lineHeight: 1.55,
                    color: colors.textMuted,
                  }}
                >
                  See what your website, reviews, and local visibility could be worth
                  before you buy another ad, rebuild another funnel, or keep guessing.
                </p>
              </div>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="#free-calculator" style={brutalButtonPrimary}>
                  Run the free calculator <TrendingUp size={16} />
                </a>
                <a
                  href={contact.facebookCommunityUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={brutalButtonSecondary}
                >
                  Join the community <Users size={16} />
                </a>
              </div>
              <div className="dd-proof-grid">
                {[
                  "Quick revenue signal",
                  "No spreadsheet required",
                  "Built for service businesses",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      ...brutalCard,
                      padding: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "0.82rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    <CheckCircle2 size={18} color={colors.primary} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                ...brutalCard,
                backgroundColor: colors.dark,
                color: colors.bone,
                padding: "clamp(24px, 4vw, 38px)",
                minHeight: "340px",
                display: "grid",
                alignContent: "space-between",
                gap: "28px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Sparkles
                aria-hidden="true"
                size={180}
                strokeWidth={1}
                style={{
                  position: "absolute",
                  right: "-18px",
                  top: "20px",
                  color: "rgba(71, 183, 212, 0.2)",
                }}
              />
              <div style={{ position: "relative" }}>
                <p style={{ ...brutalEyebrow, color: colors.primary }}>
                  Reputation + revenue
                </p>
                <h2
                  style={{
                    ...brutalHeading,
                    margin: "14px 0 0",
                    color: colors.bone,
                    fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)",
                    lineHeight: 1.02,
                  }}
                >
                  Turn trust into a measurable asset.
                </h2>
              </div>
              <p
                style={{
                  position: "relative",
                  margin: 0,
                  color: colors.boneMuted,
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  maxWidth: "520px",
                }}
              >
                The free calculator is the front door. The paid full 10x ROI
                calculator lives on Gumroad with the deeper validation levers.
              </p>
            </div>
          </div>
        </section>

        <section id="free-calculator" style={{ ...section, paddingTop: 0 }}>
          <div style={{ ...container, display: "grid", gap: "24px" }}>
            <div style={{ maxWidth: "780px" }}>
              <p style={{ ...brutalEyebrow, color: colors.warning }}>
                Start with the free ROI snapshot
              </p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: "10px 0 0",
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                What is your digital property already capable of producing?
              </h2>
            </div>
            <RoiCalculator
              onFullCalculatorClick={() => {
                window.open(fullCalculatorUrl, "_blank", "noopener,noreferrer");
              }}
            />
          </div>
        </section>

        <section style={{ ...section, backgroundColor: colors.backgroundAlt }}>
          <div
            style={{
              ...container,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            {[
              {
                title: "For the reinventor",
                text: "You know your value. This shows whether your digital footprint is carrying it.",
              },
              {
                title: "For the local expert",
                text: "Estimate revenue from calls, jobs, reviews, and the traffic you already earn.",
              },
              {
                title: "For the operator",
                text: "Move from vibes to numbers before you invest in your next growth play.",
              },
            ].map((card) => (
              <article key={card.title} style={{ ...brutalCard, padding: "24px" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "1.05rem" }}>{card.title}</h3>
                <p style={{ margin: 0, color: colors.textMuted }}>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ ...section, backgroundColor: colors.dark, color: colors.bone }}>
          <div style={{ ...container, display: "grid", gap: "20px" }}>
            <p style={{ ...brutalEyebrow, color: colors.primary }}>Next step</p>
            <h2
              style={{
                ...brutalHeading,
                margin: 0,
                color: colors.bone,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                lineHeight: 1.05,
              }}
            >
              Ready for the full 10x ROI calculator?
            </h2>
            <p style={{ margin: 0, maxWidth: "720px", color: colors.boneMuted }}>
              Buy the paid calculator on Gumroad when you want a clearer business
              case for paid traffic, reputation management, or a digital real
              estate upgrade. Join the Facebook community for prompts, visibility
              strategy, and practical digital growth support.
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <a
                href={fullCalculatorUrl}
                target="_blank"
                rel="noreferrer"
                style={brutalButtonPrimary}
              >
                Buy on Gumroad <ArrowRight size={16} />
              </a>
              <a
                href={contact.facebookCommunityUrl}
                target="_blank"
                rel="noreferrer"
                style={brutalButtonSecondary}
              >
                Join Facebook community <Users size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer
        colors={colors}
        containerStyle={container}
        footerStyle={section}
        routes={routes}
        landing={landing}
        contact={contact}
        year={year}
        showDashboardLink={false}
      />
    </div>
  );
};

export default LandingPage;
