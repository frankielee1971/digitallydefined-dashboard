import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Users, BookOpen, Star } from "lucide-react";
import CONFIG from "../config";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

const questions = [
  {
    id: 1,
    question: "When you imagine your ideal digital business, what excites you most?",
    options: [
      { text: "Creating content that helps and inspires people", value: "creator" },
      { text: "Building systems that run without me", value: "builder" },
      { text: "Teaching what I know and packaging my expertise", value: "educator" },
      { text: "Growing a loyal community of like-minded women", value: "connector" },
      { text: "Crafting a powerful personal brand that opens doors", value: "strategist" },
    ],
  },
  {
    id: 2,
    question: "Which of these feels most natural to you right now?",
    options: [
      { text: "Writing, filming, or sharing stories and ideas", value: "creator" },
      { text: "Automating, organizing, and optimizing workflows", value: "builder" },
      { text: "Explaining things clearly so others can learn fast", value: "educator" },
      { text: "Connecting people and building relationships", value: "connector" },
      { text: "Positioning, messaging, and standing out online", value: "strategist" },
    ],
  },
  {
    id: 3,
    question: "If you had a free afternoon to work on your business, you'd spend it:",
    options: [
      { text: "Batch creating content — posts, reels, carousels", value: "creator" },
      { text: "Setting up automations, tools, and workflows", value: "builder" },
      { text: "Writing a guide, course outline, or PDF playbook", value: "educator" },
      { text: "Showing up live, engaging, or hosting a session", value: "connector" },
      { text: "Researching competitors, refining my offer, storytelling", value: "strategist" },
    ],
  },
  {
    id: 4,
    question: "Which digital income stream sounds most aligned with you?",
    options: [
      { text: "Monetized content — affiliate links, brand deals, UGC", value: "creator" },
      { text: "Notion templates, tools, automated funnels, dashboards", value: "builder" },
      { text: "Online courses, workshops, PDF guides, coaching programs", value: "educator" },
      { text: "Memberships, group programs, paid communities", value: "connector" },
      { text: "Done-for-you services, consulting, digital strategy packages", value: "strategist" },
    ],
  },
  {
    id: 5,
    question: "Friends and colleagues would most likely describe you as:",
    options: [
      { text: "Creative, expressive, and always making something", value: "creator" },
      { text: "Organized, logical, and obsessed with efficiency", value: "builder" },
      { text: "Knowledgeable, patient, and great at breaking things down", value: "educator" },
      { text: "Warm, magnetic, and the one who brings people together", value: "connector" },
      { text: "Visionary, bold, and always ten steps ahead", value: "strategist" },
    ],
  },
  {
    id: 6,
    question: "What's your biggest strength from your pre-digital life?",
    options: [
      { text: "I've always had a creative eye and love for storytelling", value: "creator" },
      { text: "I built processes, solved problems, and made things run smoother", value: "builder" },
      { text: "I trained, mentored, or educated people in my field", value: "educator" },
      { text: "I led teams, built culture, or was the hub of my community", value: "connector" },
      { text: "I saw the big picture and knew how to position things for success", value: "strategist" },
    ],
  },
  {
    id: 7,
    question: "Which statement sounds most like you?",
    options: [
      { text: '"I want to create things that matter — content with real impact"', value: "creator" },
      { text: '"I want to build once and earn while I sleep"', value: "builder" },
      { text: '"My knowledge and experience deserve to be monetized"', value: "educator" },
      { text: '"I want to build something people belong to"', value: "connector" },
      { text: '"I want to be known as THE go-to expert in my space"', value: "strategist" },
    ],
  },
];

const results = {
  creator: {
    title: "The Content Creator",
    emoji: "✨",
    icon: Sparkles,
    tagline: "Your creativity IS your digital real estate.",
    description:
      "You have a natural gift for storytelling, visuals, and creating content that connects. Your superpower is your ability to turn ideas into scroll-stopping digital assets that attract an audience — and an income. Faceless content, affiliate marketing, brand partnerships, and UGC are all in your wheelhouse.",
    assets: [
      "Faceless YouTube / Reels content",
      "Affiliate marketing funnels",
      "Pinterest SEO content",
      "UGC brand partnerships",
      "Email newsletter",
    ],
    nextStep:
      "Start by identifying your niche content pillars and batch-creating 30 days of content. Your content is your currency.",
    color: "#F18B25",
  },
  builder: {
    title: "The Systems Builder",
    emoji: "⚡",
    icon: Zap,
    tagline: "You don't just work smart — you build systems that work FOR you.",
    description:
      "You think in automations, frameworks, and repeatable processes. Your superpower is turning complexity into elegance — Notion templates, automated funnels, digital dashboards, and tools that solve real problems. You build digital products that save people time, and people will pay premium prices for that.",
    assets: [
      "Automated lead funnels",
      "Notion templates and dashboards",
      "SaaS-adjacent workflows",
      "Content repurposing engines",
      "Premium process toolkits",
    ],
    nextStep:
      "Map your highest-value workflow and turn it into a sellable, repeatable system. Then start selling the transformation, not the task.",
    color: "#52C41A",
  },
  educator: {
    title: "The Expertise Educator",
    emoji: "📚",
    icon: BookOpen,
    tagline: "Your experience becomes the shortcut people pay for.",
    description:
      "You've spent decades accumulating expertise that others desperately need. Your superpower is transforming lived experience into structured learning — courses, workshops, playbooks, and coaching programs that shortcut other people's journeys.",
    assets: [
      "Mini-course funnels",
      "Coaching container templates",
      "Paid workshop sequels",
      "Membership lesson libraries",
      "Signature programs",
    ],
    nextStep:
      "Pick one small, high-impact teaching topic and create a short lead magnet that proves your model. Then invite paid learners to go deeper.",
    color: "#3366FF",
  },
  connector: {
    title: "The Community Connector",
    emoji: "💫",
    icon: Users,
    tagline: "You build belonging, momentum, and repeat business.",
    description:
      "People are drawn to you. You create belonging, safety, and momentum wherever you show up. Your superpower is building communities — Facebook groups, memberships, group coaching containers — where people come for information and stay for connection.",
    assets: [
      "Paid memberships",
      "Group coaching programs",
      "Community-led launches",
      "Membership content roadmaps",
      "Live event funnels",
    ],
    nextStep:
      "Choose a small group format, set a clear outcome, and invite the people who already trust you to join the first cohort.",
    color: "#FF6B6B",
  },
  strategist: {
    title: "The Strategy Specialist",
    emoji: "⭐",
    icon: Star,
    tagline: "You see the gap between the current state and the next-level opportunity.",
    description:
      "You think in positioning, messaging, and market differentiation. Your superpower is seeing the gap between where someone is and where they could be — and building the bridge. You're wired for consulting, done-for-you services, and brand strategy work that commands premium prices.",
    assets: [
      "Signature consulting offers",
      "Premium service packages",
      "Positioning frameworks",
      "Brand storytelling systems",
      "High-ticket launch plans",
    ],
    nextStep:
      "Start by clarifying the outcome you deliver, then package it in a premium offer for the clients who need it most.",
    color: "#A259FF",
  },
};

const calculateResult = (answers) => {
  const counts = Object.values(answers).reduce((acc, value) => {
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts);
  if (!entries.length) return "creator";

  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
};

const DigitalSuperpowerQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [resultKey, setResultKey] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const question = useMemo(
    () => questions.find((item) => item.id === currentQuestion),
    [currentQuestion],
  );

  const progress = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / questions.length) * 100;
  }, [answers]);

  useEffect(() => {
    document.title = "Digital Superpower Quiz | DigitallyDefined";
  }, []);

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const key = calculateResult(answers);
    setResultKey(key);
    setSubmitted(true);
    setShowInstructions(false);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(1);
    setSubmitted(false);
    setResultKey(null);
    setShowInstructions(true);
  };

  const handleGoToDashboard = () => {
    if (typeof window !== "undefined") {
      window.location.href = CONFIG.routes.dashboard;
    }
  };

  const result = resultKey ? results[resultKey] : null;

  return (
    <div className="dd-page">
      <style>{`
        .dd-quiz-hero {
          border-bottom: 1px solid #111111;
          background: #fffaf5;
          padding: clamp(32px, 5vw, 48px) 24px;
        }

        .dd-quiz-hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          gap: 28px;
        }

        .dd-quiz-hero-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dd-quiz-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #47b7d4;
        }

        .dd-quiz-hero-title {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.08;
          color: #111111;
          margin: 0;
          max-width: 800px;
        }

        .dd-quiz-hero-subtitle {
          font-size: clamp(1.05rem, 1.7vw, 1.2rem);
          line-height: 1.65;
          color: #5f5f5f;
          max-width: 680px;
          margin: 0;
        }

        .dd-quiz-container {
          max-width: 800px;
          margin: 0 auto;
          padding: clamp(32px, 5vw, 56px) 24px;
          display: grid;
          gap: 28px;
        }

        .dd-quiz-card {
          background: #ffffff;
          border: 1px solid #111111;
          padding: clamp(28px, 4vw, 40px);
          display: grid;
          gap: 28px;
        }

        .dd-quiz-progress-wrapper {
          display: grid;
          gap: 12px;
        }

        .dd-quiz-progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .dd-quiz-progress-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #5f5f5f;
        }

        .dd-quiz-progress-reassurance {
          font-size: 0.8rem;
          color: #5f5f5f;
          font-style: italic;
        }

        .dd-quiz-progress-bar {
          width: 100%;
          height: 4px;
          background: #f4efe8;
          border: 1px solid #111111;
          position: relative;
          overflow: hidden;
        }

        .dd-quiz-progress-fill {
          height: 100%;
          background: #47b7d4;
          transition: width 0.4s ease;
        }

        .dd-quiz-question {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(1.3rem, 2.5vw, 1.7rem);
          font-weight: 800;
          line-height: 1.3;
          color: #111111;
          margin: 0;
        }

        .dd-quiz-options {
          display: grid;
          gap: 14px;
        }

        .dd-quiz-option {
          width: 100%;
          text-align: left;
          padding: clamp(16px, 2vw, 20px) clamp(18px, 2.5vw, 24px);
          background: #ffffff;
          border: 1px solid #111111;
          color: #111111;
          font-size: clamp(0.95rem, 1.2vw, 1.05rem);
          font-weight: 600;
          line-height: 1.5;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          font-family: "DM Sans", system-ui, sans-serif;
        }

        .dd-quiz-option:hover {
          background: #f4efe8;
          transform: translateY(-2px);
        }

        .dd-quiz-option:focus {
          outline: 2px solid #47b7d4;
          outline-offset: 2px;
        }

        .dd-quiz-option--selected {
          background: rgba(71, 183, 212, 0.08);
          border-color: #47b7d4;
          border-width: 2px;
        }

        .dd-quiz-option-indicator {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border: 2px solid #111111;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
          margin-top: 2px;
        }

        .dd-quiz-option--selected .dd-quiz-option-indicator {
          background: #47b7d4;
          border-color: #47b7d4;
          color: #ffffff;
        }

        .dd-quiz-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 8px;
          border-top: 1px solid #f4efe8;
        }

        .dd-quiz-actions-right {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .dd-quiz-result-card {
          background: #ffffff;
          border: 1px solid #111111;
          padding: clamp(28px, 4vw, 40px);
          display: grid;
          gap: 24px;
        }

        .dd-quiz-result-header {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dd-quiz-result-emoji {
          font-size: 3rem;
          line-height: 1;
        }

        .dd-quiz-result-title {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 800;
          line-height: 1.1;
          color: #111111;
          margin: 0;
        }

        .dd-quiz-result-tagline {
          font-size: clamp(1.1rem, 1.5vw, 1.25rem);
          font-weight: 600;
          color: #47b7d4;
          margin: 0;
          line-height: 1.5;
        }

        .dd-quiz-result-description {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #5f5f5f;
          margin: 0;
        }

        .dd-quiz-assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .dd-quiz-asset-item {
          padding: 16px;
          background: #f4efe8;
          border: 1px solid #111111;
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.5;
        }

        .dd-quiz-next-step {
          padding: 20px;
          background: #fffaf5;
          border-left: 3px solid #47b7d4;
        }

        .dd-quiz-next-step-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #47b7d4;
          margin: 0 0 8px;
        }

        .dd-quiz-next-step-text {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #111111;
          margin: 0;
        }

        .dd-quiz-footer-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .dd-quiz-hero-meta {
            justify-content: center;
          }

          .dd-quiz-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .dd-quiz-actions-right {
            width: 100%;
          }

          .dd-quiz-actions-right button {
            width: 100%;
          }
        }
      `}</style>

      <header className="dd-quiz-hero">
        <div className="dd-quiz-hero-inner">
          <div className="dd-quiz-hero-meta">
            <Logo as="div" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a className="dd-button dd-button--secondary" href={CONFIG.routes.landing}>
                Home
              </a>
            </div>
          </div>

          <div>
            <div className="dd-quiz-hero-badge">
              <Sparkles size={18} />
              <span>Digital Superpower Quiz</span>
            </div>
            <h1 className="dd-quiz-hero-title" style={{ marginTop: "16px" }}>
              Discover the way you win online.
            </h1>
            <p className="dd-quiz-hero-subtitle" style={{ marginTop: "16px" }}>
              Answer 7 quick questions to uncover your digital superpower and get a clear next step for the business model that fits your experience, personality, and goals.
            </p>
          </div>
        </div>
      </header>

      <main>
        <div className="dd-quiz-container">
          {showInstructions && (
            <section className="dd-quiz-card">
              <h2 className="dd-quiz-question" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)" }}>
                How it works
              </h2>
              <p style={{ margin: 0, color: "#5f5f5f", lineHeight: 1.7, fontSize: "1.05rem" }}>
                Choose the option that feels most true for you in the moment. This quiz is about energy and focus, not perfection. Go with your first instinct — it's usually right.
              </p>
            </section>
          )}

          {!submitted ? (
            <section className="dd-quiz-card">
              {/* Progress */}
              <div className="dd-quiz-progress-wrapper">
                <div className="dd-quiz-progress-header">
                  <span className="dd-quiz-progress-label">
                    Question {currentQuestion} of {questions.length}
                  </span>
                  <span className="dd-quiz-progress-reassurance">Go with your first instinct</span>
                </div>
                <div className="dd-quiz-progress-bar">
                  <div className="dd-quiz-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Question */}
              <h2 className="dd-quiz-question">{question.question}</h2>

              {/* Options */}
              <div className="dd-quiz-options">
                {question.options.map((option, index) => (
                  <button
                    key={`${question.id}-${index}`}
                    type="button"
                    onClick={() => handleAnswer(option.value)}
                    className={`dd-quiz-option ${answers[currentQuestion] === option.value ? "dd-quiz-option--selected" : ""}`}
                  >
                    <span className="dd-quiz-option-indicator">
                      {answers[currentQuestion] === option.value ? "●" : "○"}
                    </span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="dd-quiz-actions">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentQuestion === 1}
                  className="dd-button dd-button--secondary"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <div className="dd-quiz-actions-right">
                  {currentQuestion < questions.length ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!answers[currentQuestion]}
                      className="dd-button dd-button--primary"
                    >
                      Next <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length < questions.length}
                      className="dd-button dd-button--primary"
                    >
                      See my superpower <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="dd-quiz-result-card">
              <div className="dd-quiz-result-header">
                <span className="dd-quiz-result-emoji">{result.emoji}</span>
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "#47b7d4",
                      marginBottom: "8px",
                    }}
                  >
                    Your digital superpower
                  </div>
                  <h2 className="dd-quiz-result-title">{result.title}</h2>
                </div>
              </div>

              <p className="dd-quiz-result-tagline">{result.tagline}</p>
              <p className="dd-quiz-result-description">{result.description}</p>

              <div style={{ display: "grid", gap: "16px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: '"Inter", system-ui, sans-serif',
                    fontSize: "clamp(1.2rem, 2vw, 1.4rem)",
                    fontWeight: 800,
                    color: "#111111",
                  }}
                >
                  Digital assets to build first
                </h3>
                <div className="dd-quiz-assets-grid">
                  {result.assets.map((asset) => (
                    <div key={asset} className="dd-quiz-asset-item">
                      {asset}
                    </div>
                  ))}
                </div>
              </div>

              <div className="dd-quiz-next-step">
                <p className="dd-quiz-next-step-label">Best next step</p>
                <p className="dd-quiz-next-step-text">{result.nextStep}</p>
              </div>

              <div className="dd-quiz-footer-actions">
                <button type="button" onClick={handleReset} className="dd-button dd-button--secondary">
                  Retake the quiz
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer
        colors={{ text: "var(--brand-text-primary)", textMuted: "var(--brand-text-muted)" }}
        containerStyle={{ maxWidth: "var(--brand-container-max-width)", margin: "0 auto" }}
        footerStyle={{ padding: "32px 24px", backgroundColor: "var(--brand-panel)" }}
        routes={CONFIG.routes}
        landing={CONFIG.landing}
        contact={CONFIG.contact}
        year={new Date().getFullYear()}
        showDashboardLink={false}
      />
    </div>
  );
};

export default DigitalSuperpowerQuiz;