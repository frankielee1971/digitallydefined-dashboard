import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Users, BookOpen, Star } from "lucide-react";
import CONFIG from "../config";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import FadeInSection from "../components/FadeInSection";
import { ddBrand, ddSection, ddContainer, ddGrid, ddStickyCta } from "../brand/dd-brand-tokens";

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
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: ddBrand.tokens.background,
        color: ddBrand.tokens.text,
        fontFamily: ddBrand.typography.body.fontFamily,
      }}
    >
      <header
        style={{
          borderBottom: ddBrand.border,
          backgroundColor: ddBrand.tokens.surface,
          padding: "18px 24px",
          position: "sticky",
          top: 0,
          zIndex: 20,
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
            <a className="dd-button dd-button--outline" href={CONFIG.routes.landing} style={{ fontSize: "0.8rem", padding: "10px 14px" }}>
              Home
            </a>
            <a className="dd-button dd-button--outline" href={CONFIG.routes.dashboard} style={{ fontSize: "0.8rem", padding: "10px 14px" }}>
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <main style={ddSection}>
        <div style={ddContainer}>
          <FadeInSection>
            <div
              style={{
                ...ddBrand.card,
                padding: "clamp(24px, 4vw, 36px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.5rem" }}>{result ? result.emoji : "✨"}</span>
                <div>
                  <div
                    style={{
                      ...ddBrand.typography.eyebrow,
                      color: ddBrand.tokens.textMuted,
                      marginBottom: "8px",
                    }}
                  >
                    Digital Superpower Quiz
                  </div>
                  <h1
                    style={{
                      ...ddBrand.typography.headingBase,
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      lineHeight: 1.05,
                    }}
                  >
                    Discover the way you win online.
                  </h1>
                </div>
              </div>
              <p
                style={{
                  ...ddBrand.typography.muted,
                  maxWidth: "780px",
                  marginTop: "16px",
                }}
              >
                Answer 7 quick questions to uncover your digital superpower and get a clear next step for the business model that fits your experience, personality, and goals.
              </p>

              {/* Progress bar */}
              {!submitted && (
                <div style={{ marginTop: "24px" }}>
                  <div
                    style={{
                      ...ddBrand.typography.eyebrow,
                      color: ddBrand.tokens.textMuted,
                      marginBottom: "8px",
                    }}
                  >
                    {currentQuestion} of {questions.length} answered
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      background: ddBrand.tokens.textMuted,
                      opacity: 0.2,
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: ddBrand.tokens.orange,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </FadeInSection>

          {showInstructions && !submitted && (
            <FadeInSection delay={100}>
              <div
                style={{
                  ...ddBrand.card,
                  padding: "clamp(20px, 3vw, 28px)",
                }}
              >
                <h2
                  style={{
                    ...ddBrand.typography.headingBase,
                    fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
                    marginBottom: "12px",
                  }}
                >
                  How it works
                </h2>
                <p style={{ ...ddBrand.typography.muted, marginTop: "0" }}>
                  Choose the option that feels most true for you in the moment. This quiz is about energy and focus, not perfection.
                </p>
              </div>
            </FadeInSection>
          )}

          <FadeInSection delay={150}>
            <div
              style={{
                ...ddBrand.card,
                padding: "clamp(20px, 3vw, 28px)",
                minHeight: "320px",
              }}
            >
              {!submitted ? (
                <div style={{ display: "grid", gap: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          ...ddBrand.typography.eyebrow,
                          color: ddBrand.tokens.textMuted,
                          margin: "0 0 8px",
                        }}
                      >
                        Question {currentQuestion} of {questions.length}
                      </p>
                      <h2
                        style={{
                          ...ddBrand.typography.headingBase,
                          fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
                          margin: 0,
                        }}
                      >
                        {question.question}
                      </h2>
                    </div>
                    <div
                      style={{
                        ...ddBrand.typography.eyebrow,
                        color: answers[currentQuestion] ? ddBrand.tokens.orange : ddBrand.tokens.textMuted,
                      }}
                    >
                      {answers[currentQuestion] ? "Answer selected" : "Choose an answer"}
                    </div>
                  </div>

                  <div className="dd-grid" style={{ gap: "14px" }}>
                    {question.options.map((option, index) => {
                      const selected = answers[currentQuestion] === option.value;
                      return (
                        <button
                          key={`${question.id}-${index}`}
                          type="button"
                          onClick={() => handleAnswer(option.value)}
                          onMouseEnter={(e) => {
                            if (!selected) {
                              e.currentTarget.style.transform = "translateY(-1px)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          className={`dd-button ${selected ? "dd-button--selected" : "dd-button--outline"}`}
                          style={{
                            justifyContent: "flex-start",
                            opacity: selected ? 1 : 0.95,
                          }}
                        >
                          <span style={{ fontWeight: 800, marginRight: "10px" }}>
                            {selected ? "●" : "○"}
                          </span>
                          {option.text}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentQuestion === 1}
                      className="dd-button dd-button--secondary"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {currentQuestion < questions.length ? (
                        <button type="button" onClick={handleNext} className="dd-button dd-button--primary">
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
                </div>
              ) : (
                <div style={{ display: "grid", gap: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.5rem" }}>{result.emoji}</span>
                    <div>
                      <div
                        style={{
                          ...ddBrand.typography.eyebrow,
                          color: ddBrand.tokens.textMuted,
                          marginBottom: "8px",
                        }}
                      >
                        Your digital superpower
                      </div>
                      <h2
                        style={{
                          ...ddBrand.typography.headingBase,
                          fontSize: "clamp(1.9rem, 4vw, 3rem)",
                          lineHeight: 1.05,
                          margin: 0,
                        }}
                      >
                        {result.title}
                      </h2>
                    </div>
                  </div>

                  <p style={{ ...ddBrand.typography.muted, maxWidth: "720px", margin: 0 }}>
                    {result.tagline}
                  </p>
                  <p style={{ ...ddBrand.typography.bodyBase, maxWidth: "720px", margin: 0 }}>
                    {result.description}
                  </p>

                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3
                      style={{
                        ...ddBrand.typography.headingBase,
                        fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                        margin: 0,
                      }}
                    >
                      Digital assets to build first
                    </h3>
                    <div className="dd-grid dd-grid--assets">
                      {result.assets.map((asset) => (
                        <div
                          key={asset}
                          style={{
                            ...ddBrand.card,
                            padding: "14px",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                          }}
                        >
                          {asset}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        ...ddBrand.typography.headingBase,
                        fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                        margin: "0 0 10px",
                      }}
                    >
                      Best next step
                    </h3>
                    <p style={{ ...ddBrand.typography.bodyBase, margin: 0 }}>{result.nextStep}</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <button type="button" onClick={handleReset} className="dd-button dd-button--secondary">
                      Retake the quiz
                    </button>
                    <button type="button" onClick={handleGoToDashboard} className="dd-button dd-button--primary">
                      Go to dashboard <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </FadeInSection>
        </div>
      </main>

      <a href="#free-calculator" style={ddStickyCta}>
        Run Calculator <Sparkles size={16} />
      </a>

      <Footer
        colors={{ text: ddBrand.tokens.text, textMuted: ddBrand.tokens.textMuted }}
        containerStyle={{ ...ddContainer, maxWidth: ddContainer.width || "1100px" }}
        footerStyle={{ ...ddSection, padding: "32px 24px", background: ddBrand.tokens.surface }}
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
