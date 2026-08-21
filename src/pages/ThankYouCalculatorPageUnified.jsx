import React from "react";
import { CheckCircle, Calculator, Home, ArrowRight } from "lucide-react";
import CONFIG from "../config";
import FadeInSection from "../components/FadeInSection";
import { ddBrand, ddSection, ddContainer, ddGrid, ddStickyCta } from "../brand/dd-brand-tokens";

const ThankYouCalculatorPage = () => {
  const tyConfig = CONFIG.thankYouCalculator;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: ddBrand.tokens.background,
        color: ddBrand.tokens.text,
        fontFamily: ddBrand.typography.body.fontFamily,
      }}
    >
      <main style={ddSection}>
        <div style={ddContainer}>
          <FadeInSection>
            <section
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80px",
                  height: "80px",
                  border: `2px solid ${ddBrand.tokens.orange}`,
                  marginBottom: "32px",
                }}
              >
                <CheckCircle size={40} color={ddBrand.tokens.orange} strokeWidth={2.5} />
              </div>

              <p
                style={{
                  ...ddBrand.typography.eyebrow,
                  color: ddBrand.tokens.orange,
                  marginBottom: "12px",
                }}
              >
                SUCCESS
              </p>

              <h1
                style={{
                  ...ddBrand.typography.headingBase,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                {tyConfig.title}
              </h1>

              <p
                style={{
                  ...ddBrand.typography.muted,
                  maxWidth: "600px",
                  margin: "24px auto 0",
                }}
              >
                {tyConfig.subtitle}. Check your email for your purchase receipt and download link.
              </p>
            </section>
          </FadeInSection>

          <FadeInSection delay={100}>
            <section style={ddSection}>
              <h2
                style={{
                  ...ddBrand.typography.headingBase,
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  textAlign: "center",
                  marginBottom: "48px",
                }}
              >
                What You Get
              </h2>

              <div
                style={{
                  ...ddGrid,
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                {tyConfig.features.map((item, index) => {
                  const icons = [Calculator, Home, CheckCircle];
                  const Icon = icons[index] || Calculator;

                  return (
                    <div
                      key={index}
                      style={{
                        ...ddBrand.card,
                        padding: "32px",
                        display: "grid",
                        gap: "20px",
                        textAlign: "left",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          border: `1px solid ${ddBrand.tokens.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={24} color={ddBrand.tokens.aquaBlue} />
                      </div>
                      <h3
                        style={{
                          ...ddBrand.typography.headingBase,
                          fontSize: "1.25rem",
                          margin: 0,
                        }}
                      >
                        {item.title}
                      </h3>
                      <p style={{ ...ddBrand.typography.muted, margin: 0 }}>
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </FadeInSection>

          <FadeInSection delay={150}>
            <section
              style={{
                ...ddSection,
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  ...ddBrand.typography.headingBase,
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  marginBottom: "32px",
                }}
              >
                Next Steps
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <a
                  href={CONFIG.contact.gumroadUrl || CONFIG.contact.fullCalculatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dd-button dd-button--primary"
                  style={{ textDecoration: "none" }}
                >
                  {tyConfig.ctaLabel} <ArrowRight size={16} />
                </a>

                <a
                  href={CONFIG.contact.website}
                  className="dd-button dd-button--secondary"
                  style={{ textDecoration: "none" }}
                >
                  {tyConfig.secondaryCtaLabel} <ArrowRight size={16} />
                </a>
              </div>
            </section>
          </FadeInSection>

          <FadeInSection delay={200}>
            <section
              style={{
                ...ddSection,
                textAlign: "center",
                borderTop: `1px solid ${ddBrand.tokens.border}`,
              }}
            >
              <p style={{ ...ddBrand.typography.muted, margin: 0 }}>
                {tyConfig.emailNote} <strong>{CONFIG.contact.email}</strong>
              </p>
            </section>
          </FadeInSection>
        </div>
      </main>

      <a href="#free-calculator" style={ddStickyCta}>
        Run Calculator <Calculator size={16} />
      </a>
    </div>
  );
};

export default ThankYouCalculatorPage;
