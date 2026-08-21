import { useState, useEffect } from "react";
import IntelligenceDashboard from "../components/intelligence/IntelligenceDashboard";
import { ddBrand, ddSection, ddContainer } from "../brand/dd-brand-tokens";
import FadeInSection from "../components/FadeInSection";

export default function IntelligencePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIntelligence() {
      try {
        const stored = localStorage.getItem('dd-quiz-results');
        let quizData = null;

        if (stored) {
          quizData = JSON.parse(stored);
          localStorage.removeItem('dd-quiz-results');
        }

        if (!quizData) {
          window.location.href = '/quiz';
          return;
        }

        const response = await fetch("/api/hermes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "intelligence",
            userId: quizData.userId || "unknown",
            answers: quizData.answers || {}
          })
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Unknown error");
        }

        const dashboardData = {
          superpower: result.data.superpower || "Builder",
          persona: {
            name: quizData.userId.split('@')[0] || "Builder",
            type: result.data.superpower || "Builder"
          },
          businessModel: {
            type: result.data.superpower || "Builder",
            description: result.data.superpowerDescription || ""
          },
          strengths: result.data.recommendations || ["Your superpower is well-defined"],
          blindspots: [],
          roadmap: result.data.roadmap?.steps ? [
            {
              phase: "Your Path",
              description: result.data.roadmap.estimatedTime || "30-60 days",
              actions: result.data.roadmap.steps || []
            }
          ] : [],
          trends: [],
          competition: [],
          opportunities: result.data.recommendations || [],
          audience: {
            description: result.data.superpowerDescription || ""
          }
        };

        setData(dashboardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIntelligence();
  }, []);

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
          {loading && (
            <FadeInSection>
              <div
                style={{
                  ...ddBrand.card,
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                <p style={{ ...ddBrand.typography.muted, margin: 0 }}>
                  Loading your intelligence package…
                </p>
              </div>
            </FadeInSection>
          )}

          {error && (
            <FadeInSection>
              <div
                style={{
                  ...ddBrand.card,
                  textAlign: "center",
                  padding: "2rem",
                  borderColor: ddBrand.tokens.danger,
                }}
              >
                <p style={{ color: ddBrand.tokens.danger, margin: 0 }}>
                  Error: {error}
                </p>
              </div>
            </FadeInSection>
          )}

          {!loading && !error && data && (
            <FadeInSection>
              <IntelligenceDashboard data={data} />
            </FadeInSection>
          )}
        </div>
      </main>
    </div>
  );
}
