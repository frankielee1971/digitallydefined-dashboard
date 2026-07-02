import React, { useEffect, useMemo, useRef, useState } from "react";
import CONFIG from "../config";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

const SYSTEM_PROMPT_BY_RESULT = {
  creator:
    "You are the DigitallyDefined website assistant for someone who just discovered their Digital Superpower is The Content Creator. Help them move from result to first real asset: niche, content pillars, 30-day batch system, monetization bridge. Stay practical and specific.",
  builder:
    "You are the DigitallyDefined website assistant for someone who just discovered their Digital Superpower is The Systems Builder. Help them pick one workflow to productize, outline a sellable system, and position it as a premium tool or template. Keep it execution-focused.",
  educator:
    "You are the DigitallyDefined website assistant for someone who just discovered their Digital Superpower is The Expertise Educator. Help them convert lived experience into a small teachable model, then a lead magnet and paid container. Keep it curriculum and offer focused.",
  connector:
    "You are the DigitallyDefined website assistant for someone who just discovered their Digital Superpower is The Community Connector. Help them design a small group format with a clear outcome, launch sequence, and membership bridge. Keep it community and retention focused.",
  strategist:
    "You are the DigitallyDefined website assistant for someone who just discovered their Digital Superpower is The Strategy Specialist. Help them clarify the outcome they sell, package it as a premium offer, and draft positioning language. Keep it high-value and client-focused.",
};

const DEFAULT_SYSTEM_PROMPT =
  "You are the DigitallyDefined website assistant. The visitor just completed the Digital Superpower Quiz. Use their quiz answers and result to recommend the best first digital real estate asset for them. Be supportive, specific, and practical. Do not execute any backend actions.";

function getSystemPrompt(resultKey, answers = {}) {
  if (resultKey && SYSTEM_PROMPT_BY_RESULT[resultKey]) {
    return `${DEFAULT_SYSTEM_PROMPT}\n\nResult context: ${SYSTEM_PROMPT_BY_RESULT[resultKey]}`;
  }
  return DEFAULT_SYSTEM_PROMPT;
}

function buildContextSummary(resultKey, answers = {}, contact = {}) {
  const resultTitle =
    resultKey === "creator"
      ? "The Content Creator"
      : resultKey === "builder"
        ? "The Systems Builder"
        : resultKey === "educator"
          ? "The Expertise Educator"
          : resultKey === "connector"
            ? "The Community Connector"
            : resultKey === "strategist"
              ? "The Strategy Specialist"
              : "Quiz Result";

  const strengthEntries = Object.entries(answers).map(([questionId, value]) => {
    const q =
      typeof questionId === "number"
        ? `Q${questionId}`
        : String(questionId);
    return `${q}: ${value}`;
  });

  return {
    resultKey,
    resultTitle,
    answers,
    strengthEntries,
    contact,
    summary: `Quiz result: ${resultTitle}. Strengths signal: ${strengthEntries.join(", ")}${contact?.email ? ` | Contact: ${contact.email}` : ""}`,
  };
}

const QuizFollowUpChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey, I saw your quiz result. Want to turn this into your best first digital asset? Tell me a little about where you’re starting from.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setThinking] = useState(false);
  const [context, setContext] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = window.sessionStorage.getItem("dd_quiz_context");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const systemPrompt = useMemo(() => getSystemPrompt(context.resultKey, context.answers), [context]);

  const loadHistory = async () => {
    const email = context?.contact?.email || "";
    if (!email) {
      setHistoryLoaded(true);
      return;
    }

    try {
      const res = await fetch("/api/hermes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || "",
        },
        body: JSON.stringify({ action: "quiz.history", email, limit: 5 }),
      });

      const data = await res.json().catch(() => null);
      if (data?.ok && Array.isArray(data.results)) {
        setHistory(data.results);
      }
    } catch {
      // ignore history load errors
    } finally {
      setHistoryLoaded(true);
    }
  };

  useEffect(() => {
    if (!historyLoaded) {
      loadHistory();
    }
  }, [historyLoaded]);

  useEffect(() => {
    if (!context.resultKey && history.length && !historyLoaded) {
      // no-op; history load is already triggered once
    }
  }, [context, history, historyLoaded]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setThinking(true);

    try {
      const API_URL = "/api/hermes";
      const body = {
        action: "hermes",
        agent: "quiz_partner",
        context: {
          quiz: context,
          source: "digitallydefined.quiz.followup",
        },
        message: text,
        conversation: [
          { role: "system", content: systemPrompt },
          ...messages,
          { role: "user", content: text },
        ],
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || "",
        },
        body: JSON.stringify(body),
      });

      const textResp = await res.text();
      const data = res.headers.get("content-type")?.includes("application/json")
        ? (() => {
            try {
              return JSON.parse(textResp);
            } catch {
              return null;
            }
          })()
        : null;

      const reply =
        data?.reply ||
        data?.message ||
        data?.output ||
        "I’m here to help you move from your quiz result to a real first asset. Want to start with content, systems, teaching, community, or strategy?";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("[QuizFollowUpChat] send failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Quick hiccup on my side. Let’s keep going manually: tell me your top interest from your quiz result, and I’ll map it to a digital real estate path.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="dd-page">
      <style>{`
        .quiz-chat-shell { max-width: 860px; margin: 0 auto; padding: 24px; display: grid; gap: 20px; }
        .quiz-chat-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .quiz-chat-title { font-family: "Inter", system-ui, sans-serif; font-weight: 800; font-size: clamp(1.4rem, 2.4vw, 1.8rem); margin: 0; color: #111111; }
        .quiz-chat-badge { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #47b7d4; }
        .quiz-chat-card { background: #ffffff; border: 1px solid #111111; padding: 16px; display: grid; gap: 12px; }
        .quiz-chat-messages { display: grid; gap: 12px; max-height: 55vh; overflow-y: auto; padding-right: 4px; }
        .quiz-chat-bubble { max-width: 85%; padding: 12px 14px; border: 1px solid #111111; line-height: 1.55; font-size: 0.98rem; }
        .quiz-chat-bubble--user { justify-self: end; background: #111111; color: #ffffff; border-color: #111111; }
        .quiz-chat-bubble--assistant { justify-self: start; background: #ffffff; color: #111111; }
        .quiz-chat-input-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .quiz-chat-input { flex: 1 1 260px; padding: 12px 14px; border: 1px solid #111111; background: #ffffff; color: #111111; font-size: 1rem; }
        .quiz-chat-send { padding: 12px 16px; background: #47b7d4; color: #ffffff; border: 1px solid #111111; font-weight: 800; cursor: pointer; }
        .quiz-chat-send:disabled { opacity: 0.6; cursor: not-allowed; }
        .quiz-chat-context { font-size: 0.82rem; color: #5f5f5f; line-height: 1.5; }
      `}</style>

      <div className="quiz-chat-shell">
        <header className="quiz-chat-header">
          <div>
            <div className="quiz-chat-badge">
              {context.resultTitle || "Digital Superpower"} ·
              Personalized path assistant
            </div>
            <h1 className="quiz-chat-title">Build the right digital real estate first.</h1>
          </div>
          <Logo as="div" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }} />
        </header>

        {context.summary && (
          <div className="quiz-chat-card">
            <div className="quiz-chat-context">
              <strong>What I already know:</strong> {context.summary}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="quiz-chat-card">
            <div style={{ fontWeight: 800, marginBottom: "8px" }}>Your quiz history</div>
            <div style={{ display: "grid", gap: "8px" }}>
              {history.slice(0, 5).map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "space-between", padding: "8px", border: "1px solid #111111" }}>
                  <div style={{ fontWeight: 700 }}>{item.result_title || "Quiz result"}</div>
                  <div style={{ color: "#5f5f5f", fontSize: "0.88rem" }}>{item.email || "anonymous"}</div>
                  <div style={{ color: "#5f5f5f", fontSize: "0.88rem" }}>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="quiz-chat-card">
          <div className="quiz-chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`quiz-chat-bubble quiz-chat-bubble--${message.role}`}>
                {message.content}
              </div>
            ))}
            {isThinking && (
              <div className="quiz-chat-bubble quiz-chat-bubble--assistant">
                Thinking about your best first path…
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className="quiz-chat-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Tell me where you’re starting from, and I’ll map the right first asset."
            className="quiz-chat-input"
          />
          <button type="button" onClick={send} className="quiz-chat-send" disabled={!input.trim() || isThinking}>
            Send
          </button>
        </div>
      </div>

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

export default QuizFollowUpChat;

export { buildContextSummary, getSystemPrompt, DEFAULT_SYSTEM_PROMPT };
