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
            backgroundColor: colors.warning,
            color: colors.surface,
            padding: "12px 16px",
            borderBottom: brutalBorder,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              ...container,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <AlertCircle size={20} strokeWidth={2.5} />
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Under Construction — New features coming soon!
              </span>
            </div>
            <button
              onClick={() => setShowUnderConstruction(false)}
              aria-label="Dismiss under construction banner"
              style={{
                background: "none",
                border: "none",
                color: colors.surface,
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
          borderBottom: brutalBorder,
          backgroundColor: colors.surface,
          padding: `18px ${theme.layout.spacing}`,
          transition: "top 0.3s ease",
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
                color: colors.textMuted,
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
        {/* ── HERO ── */}
        <section style={section}>
          <div className="dd-hero-grid" style={container}>
            <div style={{ display: "grid", gap: "24px" }}>
              <p style={{ ...brutalEyebrow, color: colors.textMuted }}>
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
                    color: colors.text,
                  }}
                >
                  <span>Define Your&nbsp;</span>
                  <span style={{ color: colors.accent }}>Digital Power.</span>
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
                  Your digital reputation is your most valuable asset. This is a
                  clear, confident system for Gen X women who want to build digital
                  real estate, grow faceless income streams, and unlock 10x ROI
                  from their online presence.
                </p>
              </div>

              {/* ── THREE CTAs: calculator + community + quiz ── */}
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
                  color: colors.textMuted,
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
                  Reputation + digital real estate
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
                Every review, listing, article, search result, and piece of
                content is a digital property. Most Gen X women already own more
                than they realize.
              </p>
            </div>
          </div>
        </section>


        {/* ── FREE CALCULATOR ── */}
        <section id="free-calculator" style={{ ...section, paddingTop: 0 }}>
          <div style={{ ...container, display: "grid", gap: "24px" }}>
            <div style={{ maxWidth: "780px" }}>
              <p style={{ ...brutalEyebrow, color: colors.warning }}>
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
              <p style={{ margin: "10px 0 0", color: colors.textMuted }}>
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


        {/* ── WHO IT'S FOR ── */}
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


        {/* ── FACELESS MARKETING ── */}
        <section style={section}>
          <div
            style={{
              ...container,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "28px",
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: "18px" }}>
              <p style={{ ...brutalEyebrow, color: colors.primary }}>
                Faceless digital marketing
              </p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: 0,
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                You don't need to be an influencer to win online.
              </h2>
              <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.65 }}>
                DigitallyDefined teaches you how to build faceless digital assets
                that work even when you're offline. No camera. No performance. No
                hustle.
              </p>
              <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.65 }}>
                Perfect for Gen X women who want privacy, freedom, and income that
                compounds over time.
              </p>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  "Privacy: build without revealing your identity",
                  "Freedom: assets that run on autopilot",
                  "Passive visibility: found without being on 24/7",
                  "Automated lead flow: processes that run independently",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <CheckCircle2 size={18} color={colors.primary} style={{ marginTop: "3px", flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <a
                href={contact.facebookCommunityUrl}
                target="_blank"
                rel="noreferrer"
                style={{ ...brutalButtonPrimary, width: "fit-content" }}
              >
                Learn faceless digital marketing <Users size={16} />
              </a>
            </div>


            <div style={{ ...brutalCard, padding: "28px" }}>
              <p style={{ ...brutalEyebrow, color: colors.primary }}>
                Faceless asset types
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                {facelessAssets.map((asset, index) => (
                  <span
                    key={asset}
                    style={{
                      border: brutalBorder,
                      padding: "8px 12px",
                      backgroundColor:
                        index % 4 === 0
                          ? colors.primary
                          : index % 4 === 2
                          ? colors.accent
                          : colors.surface,
                      color: index % 4 === 2 ? colors.surface : colors.text,
                      fontSize: "0.72rem",
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {asset}
                  </span>
                ))}
              </div>
              <p
                style={{
                  borderTop: brutalBorder,
                  margin: "24px 0 0",
                  paddingTop: "20px",
                  color: colors.textMuted,
                }}
              >
                Every one of these earns without your face, your voice, or your
                constant attention.
              </p>
            </div>
          </div>
        </section>


        {/* ── DIGITAL REAL ESTATE ── */}
        <section style={{ ...section, backgroundColor: colors.dark, color: colors.bone }}>
          <div style={{ ...container, display: "grid", gap: "28px" }}>
            <div>
              <p style={{ ...brutalEyebrow, color: colors.warning }}>
                Digital real estate
              </p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: "10px 0 0",
                  color: colors.bone,
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                Your digital footprint is real estate. Let's increase its value.
              </h2>
              <p style={{ margin: "14px 0 0", maxWidth: "760px", color: colors.boneMuted }}>
                Every review, listing, article, search result, and piece of content
                is a digital property. Most Gen X women already own more than they
                realize.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0",
                border: `1px solid ${colors.whiteBorderSoft}`,
              }}
            >
              {realEstateSteps.map((step) => (
                <article
                  key={step.number}
                  style={{
                    padding: "24px",
                    border: `1px solid ${colors.whiteBorderSoft}`,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      color: colors.primary,
                      fontSize: "2.4rem",
                      fontWeight: 900,
                      lineHeight: 1,
                      opacity: 0.55,
                      marginBottom: "16px",
                    }}
                  >
                    {step.number}
                  </div>
                  <h3 style={{ margin: "0 0 10px", color: colors.bone }}>
                    {step.title}
                  </h3>
                  <p style={{ margin: 0, color: colors.boneMuted, lineHeight: 1.6 }}>
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>


        {/* ── COMMUNITY ── */}
        <section style={section}>
          <div
            style={{
              ...container,
              ...brutalCard,
              backgroundColor: colors.dark,
              color: colors.bone,
              padding: "clamp(32px, 6vw, 64px)",
              textAlign: "center",
              display: "grid",
              justifyItems: "center",
              gap: "22px",
            }}
          >
            <p style={{ ...brutalEyebrow, color: colors.primary }}>
              DigitallyDefined community
            </p>
            <h2
              style={{
                ...brutalHeading,
                margin: 0,
                color: colors.bone,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                lineHeight: 1.05,
              }}
            >
              Clarity, confidence, and control. Together.
            </h2>
            <p style={{ margin: 0, maxWidth: "760px", color: colors.boneMuted }}>
              Inside, you'll find Gen X women building businesses, pivoting
              careers, launching new ideas, and reclaiming their digital identity
              without the noise of traditional social media.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "18px",
                width: "100%",
                maxWidth: "680px",
              }}
            >
              {[
                { value: "100%", label: "Faceless friendly" },
                { value: "Gen X", label: "Women focused" },
                { value: "Free", label: "To join" },
              ].map((stat) => (
                <div key={stat.label}>
                  <strong
                    style={{
                      display: "block",
                      color: colors.primary,
                      fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    }}
                  >
                    {stat.value}
                  </strong>
                  <span style={{ ...brutalEyebrow, color: colors.boneFaint, fontSize: "0.62rem" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <a
              href={contact.facebookCommunityUrl}
              target="_blank"
              rel="noreferrer"
              style={brutalButtonPrimary}
            >
              Join the community <Users size={16} />
            </a>
          </div>
        </section>


        {/* ── QUIZ CTA ── */}
        <section
          style={{
            ...section,
            backgroundColor: colors.dark,
            color: colors.bone,
          }}
        >
          <div
            style={{
              ...container,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: "clamp(28px, 5vw, 56px)",
              alignItems: "center",
            }}
            className="dd-quiz-cta-grid"
          >
            <div>
              <p style={{ ...brutalEyebrow, color: colors.primary, marginBottom: "14px" }}>
                Free 60-second quiz
              </p>
              <h2
                style={{
                  ...brutalHeading,
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.02,
                  color: colors.bone,
                  margin: "0 0 16px",
                }}
              >
                What&apos;s Your Digital Superpower?
              </h2>
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  lineHeight: 1.65,
                  color: colors.boneMuted,
                  maxWidth: "560px",
                  margin: "0 0 18px",
                }}
              >
                Take this quick quiz to find the digital path that fits your
                strengths, your season of life, and the kind of work you actually
                want to build.
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: colors.boneMuted,
                  maxWidth: "560px",
                  margin: "0 0 28px",
                }}
              >
                You do not need to be loud, young, on camera, or techy to build
                something real online. You just need a path that fits you better
                than the usual internet noise.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/quiz" style={brutalButtonPrimary}>
                  Find My Superpower <Sparkles size={16} />
                </a>
              </div>
              <p
                style={{
                  marginTop: "14px",
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.boneFaint,
                }}
              >
                Free · No credit card · Takes 60 seconds
              </p>
            </div>


            <div
              className="dd-quiz-stat"
              style={{
                border: `1px solid ${colors.whiteBorderSoft}`,
                padding: "clamp(24px, 4vw, 36px)",
                display: "grid",
                gap: "20px",
                minWidth: "220px",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              {[
                { label: "The Content Creator" },
                { label: "The Systems Builder" },
                { label: "The Digital Educator" },
                { label: "The Community Builder" },
                { label: "The Brand Strategist" },
              ].map(({ label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: colors.boneMuted,
                  }}
                >
                  <span style={{ fontSize: "20px" }}>
                    <Sparkles size={18} style={{ color: colors.primary }} strokeWidth={1.5} />
                  </span>
                  {label}
                </div>
              ))}
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