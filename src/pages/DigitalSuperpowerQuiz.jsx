import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Users, BookOpen, Star } from "lucide-react";
import CONFIG from "../config";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalButtonSecondary,
  brutalCard,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";

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
      { text: "\"I want to create things that matter — content with real impact\"", value: "creator" },
      { text: "\"I want to build once and earn while I sleep\"", value: "builder" },
      { text: "\"My knowledge and experience deserve to be monetized\"", value: "educator" },
      { text: "\"I want to build something people belong to\"", value: "connector" },
      { text: "\"I want to be known as THE go-to expert in my space\"", value: "strategist" },
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

  const result = resultKey ? results[resultKey] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.app,
      }}
    >
      <header
        style={{
          borderBottom: brutalBorder,
          backgroundColor: theme.colors.surface,
          padding: `24px ${theme.layout.spacing}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.layout.containerMaxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: theme.layout.spacing,
            flexWrap: "wrap",
          }}
        >
          <Logo as="div" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }} />
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href={CONFIG.routes.landing} style={brutalButtonSecondary}>
              Home
            </a>
            <a href={CONFIG.routes.dashboard} style={brutalButtonSecondary}>
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <main style={{ padding: `clamp(40px, 5vw, 60px) ${theme.layout.spacing}` }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gap: "32px",
          }}
        >
          <section
            style={{
              display: "grid",
              gap: "18px",
              padding: "32px",
              ...brutalCard,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "1.25rem" }}>{result ? result.emoji : "✨"}</span>
              <div>
                <div style={{ ...brutalEyebrow, marginBottom: "8px" }}>
                  Digital Superpower Quiz
                </div>
                <h1
                  style={{
                    ...brutalHeading,
                    margin: 0,
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                  }}
                >
                  Discover the way you win online.
                </h1>
              </div>
            </div>
            <p style={{ margin: 0, color: theme.colors.textMuted, maxWidth: "780px" }}>
              Answer 7 quick questions to uncover your digital superpower and get a clear next step for the business model that fits your experience, personality, and goals.
            </p>
          </section>

          {showInstructions && (
            <section style={{ ...brutalCard, padding: "28px" }}>
              <h2 style={{ ...brutalHeading, margin: 0 }}>How it works</h2>
              <p style={{ margin: "16px 0 0", color: theme.colors.textMuted }}>
                Choose the option that feels most true for you in the moment. This quiz is about energy and focus, not perfection.
              </p>
            </section>
          )}

          {!submitted ? (
            <section style={{ ...brutalCard, padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <p style={{ ...brutalEyebrow, margin: 0 }}>Question {currentQuestion} of {questions.length}</p>
                  <h2 style={{ margin: "12px 0 0", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>{question.question}</h2>
                </div>
                <div style={{ fontWeight: 700, color: theme.colors.primary }}>{answers[currentQuestion] ? "Answer selected" : "Choose an answer"}</div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  marginTop: "28px",
                }}
              >
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAnswer(option.value)}
                    style={{
                      ...brutalButtonSecondary,
                      justifyContent: "flex-start",
                      borderColor: answers[currentQuestion] === option.value ? theme.colors.primary : theme.colors.border,
                      color: theme.colors.text,
                    }}
                  >
                    <span style={{ fontWeight: 700, marginRight: "10px" }}>
                      {answers[currentQuestion] === option.value ? "●" : "○"}
                    </span>
                    {option.text}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentQuestion === 1}
                  style={{
                    ...brutalButtonSecondary,
                    opacity: currentQuestion === 1 ? 0.5 : 1,
                    cursor: currentQuestion === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {currentQuestion < questions.length ? (
                    <button type="button" onClick={handleNext} style={brutalButtonPrimary}>
                      Next <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length < questions.length}
                      style={{
                        ...brutalButtonPrimary,
                        opacity: Object.keys(answers).length < questions.length ? 0.6 : 1,
                        cursor: Object.keys(answers).length < questions.length ? "not-allowed" : "pointer",
                      }}
                    >
                      See my superpower <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section style={{ ...brutalCard, padding: "28px" }}>
              <div style={{ display: "grid", gap: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "1.5rem" }}>{result.emoji}</span>
                  <div>
                    <div style={{ ...brutalEyebrow, margin: 0 }}>Your digital superpower</div>
                    <h2 style={{ margin: "8px 0 0", fontSize: "clamp(2rem, 4vw, 3rem)" }}>{result.title}</h2>
                  </div>
                </div>

                <p style={{ margin: 0, color: theme.colors.textMuted, maxWidth: "720px" }}>{result.tagline}</p>
                <p style={{ margin: 0 }}>{result.description}</p>

                <div style={{ display: "grid", gap: "12px" }}>
                  <h3 style={{ margin: 0 }}>Digital assets to build first</h3>
                  <div style={{
                    display: "grid",
                    gap: "10px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  }}>
                    {result.assets.map((asset) => (
                      <div key={asset} style={{ ...brutalCard, padding: "14px" }}>
                        {asset}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 10px" }}>Best next step</h3>
                  <p style={{ margin: 0 }}>{result.nextStep}</p>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button type="button" onClick={handleReset} style={brutalButtonSecondary}>
                    Retake the quiz
                  </button>
                  <a href={CONFIG.routes.dashboard} style={brutalButtonPrimary}>
                    Go to dashboard
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer
        colors={theme.colors}
        containerStyle={{ maxWidth: theme.layout.containerMaxWidth, margin: "0 auto" }}
        footerStyle={{ padding: `32px ${theme.layout.spacing}`, backgroundColor: theme.colors.surface }}
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
