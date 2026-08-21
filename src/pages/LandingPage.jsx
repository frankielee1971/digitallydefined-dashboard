import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, Users, AlertCircle, X } from "lucide-react";
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
import FadeInSection from "../components/FadeInSection";
import { ddBrand, ddSection, ddContainer, ddGrid } from "../brand/dd-brand-tokens";

const LandingPage = () => {
  const [showUnderConstruction, setShowUnderConstruction] = useState(true);
  const year = new Date().getFullYear();
  const { colors, contact, landing, routes, seo } = CONFIG;
  const fullCalculatorUrl = contact.fullCalculatorUrl || contact.gumroadUrl;

  const facelessAssets = [
    "SEO Content",
    "Review Authority",
    "Digital Templates",
    "Automated Funnels",
    "AI Content Engines",
    "Email Courses",
    "Notion Systems",
    "PDF Playbooks",
    "Reputation Signals",
    "Digital Calculators",
  ];

  const realEstateSteps = [
    {
      number: "01",
      title: "Claim It",
      text: "Identify every digital property you already own or have a right to: Google Business, social profiles, content, reviews, listings, and search results.",
    },
    {
      number: "02",
      title: "Optimize It",
      text: "Keyword-optimize every digital property. Turn low-performing assets into lead generators and fix visibility gaps that cost money.",
    },
    {
      number: "03",
      title: "Expand It",
      text: "Add new digital properties systematically. Build a portfolio of income-producing assets that grows in value every month.",
    },
    {
      number: "04",
      title: "Monetize It",
      text: "Convert digital real estate into recurring revenue through affiliate links, digital products, service packages, and passive income streams.",
    },
  ];

  useEffect(() => {
    document.title = "DigitallyDefined | Build Your Digital Empire";
    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      "For Gen X women reinventing themselves digitally. Build faceless digital assets, grow passive income, and multiply your digital reputation 10x.",
    );
  }, [seo.description, seo.title]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: ddBrand.tokens.background,
        color: ddBrand.tokens.text,
        fontFamily: ddBrand.typography.body.fontFamily,
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

        .dd-quiz-cta-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: clamp(28px, 5vw, 56px);
          align-items: center;
        }

        .dd-quiz-stat {
          display: grid;
        }

        @media (max-width: 920px) {
          .dd-hero-grid,
          .dd-roi-calculator__top,
          .dd-quiz-cta-grid {
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

          .dd-quiz-stat {
            display: none !important;
          }
        }
      `}</style>

      {showUnderConstruction && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 25,
            backgroundColor: ddBrand.tokens.warning,
            color: "#000000",
            padding: "12px 16px",
            borderBottom: ddBrand.border,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              ...ddContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <AlertCircle size={20} strokeWidth={2.5} />
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Under Construction - New features coming soon!
              </span>
            </div>
            <button
              onClick={() => setShowUnderConstruction(false)}
              aria-label="Dismiss under construction banner"
              style={{
                background: "none",
                border: "none",
                color: "#000000",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      <header
        style={{
          position: "sticky",
          top: showUnderConstruction ? "46px" : 0,
          zIndex: 20,
          borderBottom: ddBrand.border,
          backgroundColor: ddBrand.tokens.surface,
          padding: `18px ${ddContainer.width ? '24px' : '24px'}`,
          transition: "top 0.3s ease",
        }}
      >
        <div
          style={{
            ...ddContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <Logo as="div" style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="https://digitallydefined.online"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: ddBrand.tokens.textMuted,
                textDecoration: "none",
              }}
            >
              DigitallyDefined.com
            </a>
            <a
              href="/quiz"
              style={{ ...brutalButtonSecondary, display: "flex", alignItems: "center", gap: "8px" }}
            >
              Take the quiz <Sparkles size={16} />
            </a>
          </div>
        </div>
      </header>

      <main>
        <FadeInSection>
          <section style={ddSection}>
            <div className="dd-hero-grid" style={ddContainer}>
              <div style={{ display: "grid", gap: "24px" }}>
                <p style={{ ...brutalEyebrow, color: ddBrand.tokens.textMuted }}>
                  For Gen X women reinventing themselves, digitally
                </p>
                <div style={{ minWidth: 0 }}>
                  <h1
                    className="dd-brand-hero"
                    style={{
                      ...brutalHeading,
                      margin: 0,
                      fontSize: "clamp(2.6rem, 5vw, 4rem)",
                      lineHeight: 0.98,
                      color: ddBrand.tokens.text,
                    }}
                  >
                    <span>Define Your&nbsp;</span>
                    <span style={{ color: ddBrand.tokens.orange }}>Digital Power.</span>
                  </h1>
                  <p
                    style={{
                      margin: "18px 0 0",
                      maxWidth: "680px",
                      fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                      lineHeight: 1.55,
                      color: ddBrand.tokens.textMuted,
                    }}
                  >
                    Your digital reputation is your most valuable asset. This is a
                    clear, confident system for Gen X women who want to build digital
                    real estate, grow faceless income streams, and unlock 10x ROI
                    from their online presence.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <a href="#free-calculator" style={brutalButtonPrimary}>
                    Run the free calculator <TrendingUp size={16} />
                  </a>
                  <a href={routes.quiz} style={brutalButtonSecondary}>
                    Discover your digital superpower <Sparkles size={16} />
                  </a>
                  <a
                    href={contact.facebookCommunityUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={brutalButtonSecondary}
                  >
                    Join the community <Users size={16} />
                  </a>
                  <a href="/quiz" style={brutalButtonSecondary}>
                    Find my superpower <Sparkles size={16} />
                  </a>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: ddBrand.tokens.textMuted,
                    fontSize: "0.82rem",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  You're not starting from scratch. You're starting from experience.
                </p>
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
                      <CheckCircle2 size={18} color={ddBrand.tokens.orange} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  ...brutalCard,
                  backgroundColor: ddBrand.tokens.text,
                  color: ddBrand.tokens.background,
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
                  <p style={{ ...brutalEyebrow, color: ddBrand.tokens.orange }}>
                    Reputation + digital real estate
                  </p>
                  <h2
                    style={{
                      ...brutalHeading,
                      margin: "14px 0 0",
                      color: ddBrand.tokens.background,
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
                    color: "rgba(255, 252, 249, 0.85)",
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    maxWidth: "520px",
                  }}
                >
                  Every review, listing, article, search result, and piece of
                  content is a digital property. Most Gen X women already own more
                  than they realize.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={100}>
          <section id="free-calculator" style={{ ...ddSection, paddingTop: 0 }}>
            <div style={{ ...ddContainer, display: "grid", gap: "24px" }}>
              <div style={{ maxWidth: "780px" }}>
                <p style={{ ...brutalEyebrow, color: ddBrand.tokens.warning }}>
                  Free tool
                </p>
                <h2
                  style={{
                    ...brutalHeading,
                    margin: "10px 0 0",
                    fontSize: "clamp(1.9rem, 4vw, 3rem)",
                    lineHeight: 1.05,
                  }}
                >
                  Your digital presence is already generating value.
                </h2>
                <p style={{ margin: "10px 0 0", color: ddBrand.tokens.textMuted }}>
                  This calculator shows you how much, instantly.
                </p>
              </div>
              <RoiCalculator
                onFullCalculatorClick={() => {
                  window.open(fullCalculatorUrl, "_blank", "noopener,noreferrer");
                }}
              />
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={100}>
          <section style={{ ...ddSection, backgroundColor: "#F4EFE8" }}>
            <div
              style={{
                ...ddContainer,
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
                  <p style={{ margin: 0, color: ddBrand.tokens.textMuted }}>{card.text}</p>
                </article>
              ))}
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={100}>
          <section style={ddSection}>
            <div
              style={{
                ...ddContainer,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "28px",
                alignItems: "start",
              }}
            >
              <div style={{ display: "grid", gap: "18px" }}>
                <p style={{ ...brutalEyebrow, color: ddBrand.tokens.aquaBlue }}>
                  Faceless marketing
                </p>
                <h2
                  style={{
                    ...brutalHeading,
                    margin: "10px 0 0",
                    fontSize: "clamp(1.9rem, 4vw, 3rem)",
                    lineHeight: 1.05,
                  }}
                >
                  Build once. Sell forever.
                </h2>
                <p style={{ margin: "10px 0 0", color: ddBrand.tokens.textMuted }}>
                  These are the digital assets that keep working while you sleep.
                </p>
              </div>
              <div
                style={{
                  ...ddGrid,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                {facelessAssets.map((item) => (
                  <div
                    key={item}
                    style={{
                      ...brutalCard,
                      padding: "16px",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>
      </main>

      <Footer year={year} />
    </div>
  );
};

export default LandingPage;
