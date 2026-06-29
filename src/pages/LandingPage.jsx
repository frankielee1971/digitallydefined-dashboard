import React, { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, TrendingUp, Users, AlertCircle, X } from "lucide-react";
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
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);
  const year = new Date().getFullYear();
  const { colors, contact, landing, routes, seo } = CONFIG;
  const fullCalculatorUrl = contact.fullCalculatorUrl || contact.gumroadUrl;


  const assetPaths = [
    {
      type: "Visibility Assets",
      description: "SEO content, reviews, listings, and reputation signals that make you findable without being everywhere.",
      icon: "🔍",
    },
    {
      type: "Product Assets",
      description: "Templates, calculators, Notion systems, and playbooks that sell while you sleep.",
      icon: "📦",
    },
    {
      type: "Automation Assets",
      description: "Funnels, email sequences, and AI content engines that work on your schedule.",
      icon: "⚙️",
    },
    {
      type: "Audience Assets",
      description: "Community, authority positioning, and trust ecosystems that compound over time.",
      icon: "👥",
    },
  ];


  useEffect(() => {
    document.title = "DigitallyDefined | Find Your Digital Superpower";
    let metaDescription = document.querySelector('meta[name="description"]');


    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }


    metaDescription.setAttribute(
      "content",
      "Take the 60-second quiz to discover which faceless digital income path fits your strengths, lifestyle, and goals. Built for Gen X women reinventing themselves.",
    );
  }, [seo.description, seo.title]);


  const container = {
    maxWidth: theme.layout.containerMaxWidth,
    margin: "0 auto",
  };
  const section = {
    padding: `clamp(48px, 7vw, 88px) clamp(${theme.layout.spacing}, 4vw, 32px)`,
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
          grid-template-columns: 1fr;
          gap: clamp(32px, 5vw, 56px);
          align-items: center;
          text-align: center;
        }


        .dd-hero-content {
          max-width: 780px;
          margin: 0 auto;
          display: grid;
          gap: clamp(18px, 2.5vw, 28px);
        }


        .dd-brand-hero {
          display: flex;
          flex-wrap: wrap;
          column-gap: 0;
          row-gap: 0;
          justify-content: center;
        }


        .dd-proof-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          max-width: 680px;
          margin: 0 auto;
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


        .dd-asset-paths {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }


        .dd-hero-cta-row {
          display: flex;
          gap: 14px;
          flexWrap: wrap;
          justifyContent: center;
          alignItems: center;
        }


        .dd-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 0;
        }


        .dd-faceless-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 28px;
          align-items: start;
        }


        .dd-audience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
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
            padding: "10px 16px",
            borderBottom: brutalBorder,
            transition: "all 0.3s ease",
            fontSize: "0.85rem",
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
              <AlertCircle size={18} strokeWidth={2.5} />
              <span style={{ fontWeight: 700 }}>New features coming soon</span>
            </div>
            <button
              onClick={() => setShowUnderConstruction(false)}
              aria-label="Dismiss banner"
              style={{
                background: "none",
                border: "none",
                color: colors.surface,
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}


      <header
        style={{
          position: "sticky",
          top: showUnderConstruction ? "38px" : 0,
          zIndex: 20,
          borderBottom: brutalBorder,
          backgroundColor: colors.surface,
          padding: `16px ${theme.layout.spacing}`,
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
          <a
            href="/quiz"
            style={{ ...brutalButtonSecondary, display: "flex", alignItems: "center", gap: "8px" }}
          >
            Take the quiz <Sparkles size={16} />
          </a>
        </div>
      </header>


      <main>
        {/* ── HERO: Clean, Centered, Quiz-First ── */}
        <section style={{ ...section, paddingTop: "clamp(40px, 6vw, 72px)", paddingBottom: "clamp(56px, 8vw, 96px)" }}>
          <div className="dd-hero-grid" style={container}>
            <div className="dd-hero-content">
              {/* ── Eyebrow ── */}
              <p
                style={{
                  ...brutalEyebrow,
                  color: colors.primary,
                  fontSize: "clamp(0.7rem, 1.1vw, 0.78rem)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                For Gen X women building income without being online 24/7
              </p>

              {/* ── Headline ── */}
              <h1
                style={{
                  ...brutalHeading,
                  fontSize: "clamp(2.3rem, 5.5vw, 4rem)",
                  lineHeight: 1.08,
                  color: colors.text,
                  fontWeight: 800,
                  maxWidth: "880px",
                  margin: "0 auto",
                }}
              >
                Find the faceless digital income path that fits you best
              </h1>

              {/* ── Subheadline ── */}
              <p
                style={{
                  fontSize: "clamp(1.05rem, 1.7vw, 1.22rem)",
                  lineHeight: 1.65,
                  color: colors.textMuted,
                  maxWidth: "640px",
                  margin: "0 auto",
                }}
              >
                Take the 60-second quiz to discover which type of digital asset matches your strengths, lifestyle, and income goals — so you can stop second-guessing and start building the right thing.
              </p>

              {/* ── PRIMARY CTA: Quiz ── */}
              <div className="dd-hero-cta-row">
                <a
                  href="/quiz"
                  style={{
                    ...brutalButtonPrimary,
                    padding: "clamp(15px, 2vw, 20px) clamp(28px, 3.5vw, 40px)",
                    fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  Take the 60-Second Quiz <Sparkles size={18} />
                </a>
                <a
                  href="#how-it-works"
                  style={{
                    ...brutalButtonSecondary,
                    padding: "clamp(15px, 2vw, 20px) clamp(28px, 3.5vw, 40px)",
                    fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                  }}
                >
                  See How It Works
                </a>
              </div>

              {/* ── Trust line ── */}
              <p
                style={{
                  margin: 0,
                  color: colors.textMuted,
                  fontSize: "clamp(0.78rem, 1vw, 0.85rem)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Free · Faceless-friendly · No credit card · Takes 60 seconds
              </p>

              {/* ── Trust signals (simplified) ── */}
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
                      padding: "clamp(12px, 1.4vw, 16px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      fontSize: "clamp(0.72rem, 0.95vw, 0.8rem)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    <CheckCircle2 size={18} color={colors.primary} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ ...section, backgroundColor: colors.backgroundAlt }}>
          <div style={{ ...container, display: "grid", gap: "clamp(28px, 4vw, 44px)" }}>
            <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
              <p style={{ ...brutalEyebrow, color: colors.primary }}>How it works</p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: "10px 0 0",
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                Three steps. Total clarity.
              </h2>
              <p style={{ margin: "14px 0 0", color: colors.textMuted, lineHeight: 1.65 }}>
                You're not starting from scratch. You're starting from experience. The quiz helps you identify which digital assets you already own and which path will give you the fastest return.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "0",
                border: `1px solid ${colors.border}`,
              }}
            >
              {[
                {
                  number: "01",
                  title: "Take the quiz",
                  text: "Answer 6 quick questions about your skills, interests, and current digital footprint.",
                },
                {
                  number: "02",
                  title: "Get your match",
                  text: "Receive your personalized digital real estate profile with a clear next-step recommendation.",
                },
                {
                  number: "03",
                  title: "Build with focus",
                  text: "Start with the asset type that matches your strengths. No overwhelm. No guesswork.",
                },
              ].map((step) => (
                <article
                  key={step.number}
                  style={{
                    padding: "28px",
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.surface,
                  }}
                >
                  <div
                    style={{
                      color: colors.primary,
                      fontSize: "2.6rem",
                      fontWeight: 900,
                      lineHeight: 1,
                      opacity: 0.5,
                      marginBottom: "18px",
                    }}
                  >
                    {step.number}
                  </div>
                  <h3 style={{ margin: "0 0 10px", color: colors.text, fontSize: "1.15rem" }}>{step.title}</h3>
                  <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.65 }}>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>


        {/* ── ASSET PATHS ── */}
        <section style={section}>
          <div style={{ ...container, display: "grid", gap: "clamp(24px, 4vw, 40px)" }}>
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
              <p style={{ ...brutalEyebrow, color: colors.primary }}>Your possible paths</p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: "10px 0 0",
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                Four ways to build income without being on camera
              </h2>
              <p style={{ margin: "14px 0 0", color: colors.textMuted, lineHeight: 1.65 }}>
                The quiz matches you to one of these paths based on your existing strengths and goals. Each path can become a sustainable income stream.
              </p>
            </div>
            <div className="dd-asset-paths">
              {assetPaths.map((path) => (
                <div
                  key={path.type}
                  style={{
                    ...brutalCard,
                    padding: "clamp(20px, 2.5vw, 28px)",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <div style={{ fontSize: "2rem" }}>{path.icon}</div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>{path.type}</h3>
                  <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.6, fontSize: "0.95rem" }}>
                    {path.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── FACELESS ADVANTAGE ── */}
        <section style={{ ...section, backgroundColor: colors.backgroundAlt }}>
          <div style={{ ...container, display: "grid", gap: "clamp(24px, 4vw, 40px)" }}>
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
              <p style={{ ...brutalEyebrow, color: colors.primary }}>The faceless advantage</p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: "10px 0 0",
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                Build income without the performance
              </h2>
              <p style={{ margin: "14px 0 0", color: colors.textMuted, lineHeight: 1.65 }}>
                You don't need to be an influencer, content creator, or public figure to build meaningful income online. Faceless digital assets give you privacy, leverage, and compounding value.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
              }}
            >
              {[
                {
                  title: "Privacy first",
                  text: "Build without revealing your identity. Your business stays yours.",
                },
                {
                  title: "True flexibility",
                  text: "Assets that run on autopilot. Work when you want, not when the algorithm demands.",
                },
                {
                  title: "Compounding value",
                  text: "Content and systems that earn passively and grow in value over time.",
                },
                {
                  title: "Less pressure",
                  text: "No constant posting, no on-camera presence, no performative hustle.",
                },
              ].map((item) => (
                <div key={item.title} style={{ ...brutalCard, padding: "24px", display: "grid", gap: "10px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{item.title}</h3>
                  <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.6 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── WHO IT'S FOR ── */}
        <section style={section}>
          <div style={{ ...container, display: "grid", gap: "clamp(24px, 4vw, 40px)" }}>
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
              <p style={{ ...brutalEyebrow, color: colors.primary }}>Who this is for</p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: "10px 0 0",
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                For the woman who is done waiting
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
              }}
            >
              {[
                {
                  title: "The reinventor",
                  text: "You're rebuilding after burnout, divorce, caregiving, or a career shift. You know your value. Now you need a digital footprint that reflects it.",
                },
                {
                  title: "The operator",
                  text: "You've built skills, businesses, or careers. Now you want systems that work as hard as you do without constant babysitting.",
                },
                {
                  title: "The privacy seeker",
                  text: "You want income and impact without becoming an influencer. No camera, no performance, no 24/7 visibility required.",
                },
              ].map((card) => (
                <article key={card.title} style={{ ...brutalCard, padding: "28px", display: "grid", gap: "12px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{card.title}</h3>
                  <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.65 }}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>


        {/* ── ROI CALCULATOR (secondary, positioned lower) ── */}
        <section id="free-calculator" style={{ ...section, backgroundColor: colors.backgroundAlt }}>
          <div style={{ ...container, display: "grid", gap: "24px" }}>
            <div style={{ maxWidth: "780px" }}>
              <p style={{ ...brutalEyebrow, color: colors.warning }}>Optional next step</p>
              <h2
                style={{
                  ...brutalHeading,
                  margin: "10px 0 0",
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                }}
              >
                Once you know your path, estimate what your current digital footprint may already be worth.
              </h2>
              <p style={{ margin: "10px 0 0", color: colors.textMuted, lineHeight: 1.65 }}>
                Take the quiz first to identify your best-fit asset type, then use this calculator to see your potential.
              </p>
            </div>
            <RoiCalculator
              onFullCalculatorClick={() => {
                window.open(fullCalculatorUrl, "_blank", "noopener,noreferrer");
              }}
            />
          </div>
        </section>


        {/* ── COMMUNITY ── */}
        <section style={{ ...section, backgroundColor: colors.dark, color: colors.bone }}>
          <div
            style={{
              ...container,
              ...brutalCard,
              backgroundColor: colors.dark,
              color: colors.bone,
              padding: "clamp(36px, 6vw, 72px)",
              textAlign: "center",
              display: "grid",
              justifyItems: "center",
              gap: "24px",
            }}
          >
            <p style={{ ...brutalEyebrow, color: colors.primary }}>DigitallyDefined community</p>
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
            <p style={{ margin: 0, maxWidth: "680px", color: colors.boneMuted, lineHeight: 1.65 }}>
              Inside, you'll find Gen X women building businesses, pivoting careers, and reclaiming their digital identity without the noise of traditional social media.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "18px",
                width: "100%",
                maxWidth: "640px",
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


        {/* ── FINAL CTA ── */}
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
                Your move
              </p>
              <h2
                style={{
                  ...brutalHeading,
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.02,
                  color: colors.bone,
                  margin: "0 0 18px",
                }}
              >
                Stop managing by gut. Start commanding with data.
              </h2>
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  lineHeight: 1.65,
                  color: colors.boneMuted,
                  maxWidth: "560px",
                  margin: "0 0 22px",
                }}
              >
                The quiz takes 60 seconds. The clarity lasts a lifetime. Find out which digital real estate path is built for your strengths, your season, and the income you want to build.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="/quiz" style={brutalButtonPrimary}>
                  Take the 60-Second Quiz <Sparkles size={18} />
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
                { emoji: "🔍", label: "Visibility Assets" },
                { emoji: "📦", label: "Product Assets" },
                { emoji: "⚙️", label: "Automation Assets" },
                { emoji: "👥", label: "Audience Assets" },
              ].map(({ emoji, label }) => (
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
                  <span style={{ fontSize: "20px" }}>{emoji}</span>
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