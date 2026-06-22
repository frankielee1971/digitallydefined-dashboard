import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Zap, Users, BookOpen, Star } from "lucide-react";
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
      "Notion templates & systems",
      "Automated email funnels",
      "Digital dashboards (like this one!)",
      "Productivity tools & PDF playbooks",
      "Done-for-you automation setups",
    ],
    nextStep:
      "Package one system you already use in your own life into a Notion template or digital product. Your first sale is closer than you think.",
    color: "#47B7D4",
  },
  educator: {
    title: "The Digital Educator",
    emoji: "📚",
    icon: BookOpen,
    tagline: "Your experience is worth more than you've ever charged for it.",
    description:
      "You've spent decades accumulating expertise that others desperately need. Your superpower is transforming lived experience into structured learning — courses, workshops, playbooks, and coaching programs that shortcut other people's journeys.",
    assets: [
      "Mini-courses & workshops",
      "PDF guides & playbooks",
      "Email courses",
      "1:1 or group coaching programs",
      "YouTube educational content",
    ],
    nextStep:
      "Write down the top 5 questions people always ask you. That's your first course outline. Your knowledge is already a product.",
    color: "#16A34A",
  },
  connector: {
    title: "The Community Builder",
    emoji: "👑",
    icon: Users,
    tagline: "You don't just grow an audience — you grow a movement.",
    description:
      "People are drawn to you. You create belonging, safety, and momentum wherever you show up. Your superpower is building communities — Facebook groups, memberships, group coaching containers — where people come for information and stay for connection.",
    assets: [
      "Paid Facebook group / community",
      "Membership site or subscription",
      "Group coaching program",
      "Live event series or masterminds",
      "Ambassador / referral programs",
    ],
    nextStep:
      "Turn your existing free community into a premium experience. Even 50 members at $27/month is $1,350 recurring. That's your starting point.",
    color: "#7C3AED",
  },
  strategist: {
    title: "The Brand Strategist",
    emoji: "🎯",
    icon: Star,
    tagline: "You see what others miss — and that's your most valuable asset.",
    description:
      "You think in positioning, messaging, and market differentiation. Your superpower is seeing the gap between where someone is and where they could be — and building the bridge. You're wired for consulting, done-for-you services, and brand strategy work that commands premium prices.",
    assets: [
      "Digital strategy consulting packages",
      "Done-for-you reputation management",
      "Keyword research & SEO audits",
      "Personal brand development",
      "High-ticket offers & VIP days",
    ],
    nextStep:
      "Package your strategic eye into a signature offer. A 90-minute digital audit + roadmap session is your fastest path to your first $500 online.",
    color: "#C20F0A",
  },
};

const DigitalSuperpowerQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { colors, contact } = CONFIG;

  const container = {
    maxWidth: theme.layout.containerMaxWidth,
    margin: "0 auto",
  };

  const section = {
    padding: `clamp(44px, 7vw, 84px) clamp(${theme.layout.spacing}, 4vw, 32px)`,
  };

  const calculateResult = (finalAnswers) => {
    const counts = {
      creator: 0,
      builder: 0,
      educator: 0,
      connector: 0,
      strategist: 0,
    };

    finalAnswers.forEach((value) => {
      if (counts[value] !== undefined) counts[value] += 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [...answers, selectedOption];

    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setAnswers(newAnswers);
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;

    const previousAnswers = answers.slice(0, -1);
    const previousSelection = answers[currentQuestion - 1] || null;

    setAnswers(previousAnswers);
    setCurrentQuestion(currentQuestion - 1);
    setSelectedOption(previousSelection);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResult(false);
    setEmail("");
    setEmailSubmitted(false);
    setEmailError("");
    setIsSubmitting(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setEmailError("");

    try {
      const superpowerKey = calculateResult(answers);
      const payload = {
        type: "quiz_lead",
        email,
        superpower: results[superpowerKey].title,
        timestamp: new Date().toISOString(),
      };

      await fetch(CONFIG.integrations?.googleSheetsUrl || "", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      setEmailSubmitted(true);
    } catch (error) {
      setEmailSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResult) {
    const resultKey = calculateResult(answers);
    const result = results[resultKey];

    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: theme.fonts.app,
        }}
      >
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
            <a href="/" style={brutalButtonSecondary}>
              ← Back to Home
            </a>
          </div>
        </header>

        <main>
          <section style={section}>
            <div style={{ ...container, maxWidth: "780px" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <p
                  style={{
                    ...brutalEyebrow,
                    color: colors.textMuted,
                    marginBottom: "16px",
                  }}
                >
                  Your Digital Superpower Is
                </p>
                <div style={{ fontSize: "64px", marginBottom: "16px", lineHeight: 1 }}>
                  {result.emoji}
                </div>
                <h1
                  style={{
                    ...brutalHeading,
                    fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                    lineHeight: 1,
                    color: colors.text,
                    margin: "0 0 12px",
                  }}
                >
                  {result.title}
                </h1>
                <p
                  style={{
                    fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                    color: result.color,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: 0,
                  }}
                >
                  {result.tagline}
                </p>
              </div>

              <div
                style={{
                  ...brutalCard,
                  padding: "clamp(24px, 4vw, 36px)",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    color: colors.text,
                    margin: 0,
                  }}
                >
                  {result.description}
                </p>
              </div>

              <div
                style={{
                  ...brutalCard,
                  padding: "clamp(24px, 4vw, 36px)",
                  marginBottom: "24px",
                  backgroundColor: colors.dark,
                  color: colors.bone,
                }}
              >
                <p
                  style={{
                    ...brutalEyebrow,
                    color: result.color,
                    marginBottom: "18px",
                  }}
                >
                  Your Best Digital Assets to Build
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {result.assets.map((asset) => (
                    <li
                      key={asset}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: result.color,
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      />
                      {asset}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  ...brutalCard,
                  padding: "clamp(24px, 4vw, 36px)",
                  marginBottom: "32px",
                }}
              >
                <p
                  style={{
                    ...brutalEyebrow,
                    color: result.color,
                    marginBottom: "10px",
                  }}
                >
                  Your Next Step
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.65,
                    color: colors.text,
                    margin: 0,
                  }}
                >
                  {result.nextStep}
                </p>
              </div>

              <div
                style={{
                  ...brutalCard,
                  padding: "clamp(24px, 4vw, 36px)",
                  marginBottom: "32px",
                  backgroundColor: colors.backgroundAlt,
                }}
              >
                {!emailSubmitted ? (
                  <>
                    <p
                      style={{
                        ...brutalEyebrow,
                        color: colors.textMuted,
                        marginBottom: "10px",
                      }}
                    >
                      Get Your Full Superpower Breakdown
                    </p>
                    <h2
                      style={{
                        ...brutalHeading,
                        fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
                        margin: "0 0 12px",
                        color: colors.text,
                      }}
                    >
                      Want a deeper breakdown + action plan?
                    </h2>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: colors.textMuted,
                        lineHeight: 1.6,
                        marginBottom: "20px",
                      }}
                    >
                      Drop your email and I&apos;ll send you a personalized digital roadmap
                      for the {result.title} — plus the exact tools and first steps I
                      recommend.
                    </p>

                    <form
                      onSubmit={handleEmailSubmit}
                      style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{
                          flex: "1 1 240px",
                          padding: "14px 16px",
                          border: brutalBorder,
                          borderRadius: "0px",
                          fontSize: "0.95rem",
                          fontFamily: theme.fonts.body,
                          backgroundColor: colors.surface,
                          color: colors.text,
                          outline: "none",
                        }}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          ...brutalButtonPrimary,
                          opacity: isSubmitting ? 0.7 : 1,
                        }}
                      >
                        {isSubmitting ? "Sending..." : "Send My Roadmap"}{" "}
                        <ArrowRight size={16} />
                      </button>
                    </form>

                    {emailError && (
                      <p
                        style={{
                          color: colors.danger,
                          fontSize: "0.85rem",
                          marginTop: "8px",
                          fontWeight: 700,
                        }}
                      >
                        {emailError}
                      </p>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
                    <h3
                      style={{
                        ...brutalHeading,
                        fontSize: "1.4rem",
                        margin: "0 0 8px",
                        color: colors.text,
                      }}
                    >
                      You&apos;re in!
                    </h3>
                    <p
                      style={{
                        color: colors.textMuted,
                        fontSize: "0.95rem",
                        margin: 0,
                      }}
                    >
                      Check your inbox — your personalized roadmap is on its way.
                    </p>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: "32px",
                }}
              >
                <a
                  href={contact.facebookCommunityUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={brutalButtonPrimary}
                >
                  Join the Community <Users size={16} />
                </a>
                <button onClick={handleRestart} style={brutalButtonSecondary}>
                  Retake the Quiz <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: theme.fonts.app,
      }}
    >
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
          <a href="/" style={brutalButtonSecondary}>
            ← Back to Home
          </a>
        </div>
      </header>

      <main>
        <section style={section}>
          <div style={{ ...container, maxWidth: "680px" }}>
            <p
              style={{
                ...brutalEyebrow,
                color: colors.textMuted,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Digital Superpower Quiz
            </p>

            <div style={{ marginBottom: "36px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: colors.textMuted,
                  }}
                >
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: colors.accent,
                  }}
                >
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  {" "}Complete
                </span>
              </div>

              <div
                style={{
                  height: "6px",
                  backgroundColor: colors.backgroundAlt,
                  border: brutalBorder,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    backgroundColor: colors.accent,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            <h1
              style={{
                ...brutalHeading,
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                lineHeight: 1.2,
                marginBottom: "28px",
                color: colors.text,
              }}
            >
              {question.question}
            </h1>

            <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
              {question.options.map((option) => {
                const isSelected = selectedOption === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    style={{
                      ...brutalCard,
                      padding: "18px 20px",
                      textAlign: "left",
                      cursor: "pointer",
                      backgroundColor: isSelected ? colors.dark : colors.surface,
                      color: isSelected ? colors.bone : colors.text,
                      borderColor: isSelected ? colors.accent : "#111111",
                      borderWidth: isSelected ? "2px" : "1px",
                      fontFamily: theme.fonts.body,
                      fontSize: "0.97rem",
                      lineHeight: 1.5,
                      fontWeight: isSelected ? 700 : 400,
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        flexShrink: 0,
                        border: `2px solid ${isSelected ? colors.accent : "#111"}`,
                        backgroundColor: isSelected ? colors.accent : "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: colors.dark,
                            display: "block",
                          }}
                        />
                      )}
                    </span>
                    {option.text}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                style={{
                  ...brutalButtonSecondary,
                  opacity: currentQuestion === 0 ? 0.3 : 1,
                  cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedOption}
                style={{
                  ...brutalButtonPrimary,
                  opacity: !selectedOption ? 0.4 : 1,
                  cursor: !selectedOption ? "not-allowed" : "pointer",
                }}
              >
                {currentQuestion === questions.length - 1
                  ? "See My Superpower"
                  : "Next"}{" "}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DigitalSuperpowerQuiz;