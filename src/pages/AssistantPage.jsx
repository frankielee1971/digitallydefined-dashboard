import { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import { getAnalyticsBrief, formatBriefAsContext } from "../lib/analytics";

const PARTNER_SYSTEM_PROMPT = `You are Hermes, the AI Business Partner inside DigitallyDefined.
You help Francesca scale digitallydefined.online using REAL website data supplied below.
- Summarize incoming data when asked "how is the site doing".
- Detect opportunities and high-performing content.
- Warn about failing funnels (low quiz completion, high bounce, weak visitor→lead rate).
- Suggest new pages, products, or automations grounded in observed behavior.
- Always propose a concrete next step. Never invent numbers not present in the data.`;

export default function AssistantPage() {
  const [analyticsContext, setAnalyticsContext] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your DigitallyDefined AI Business Partner. I read your live website analytics. What should we move on next?" }
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [model, setModel] = useState(null);
  const messagesEndRef = useRef(null);

  // Load the live analytics snapshot so every reply is grounded in real data.
  useEffect(() => {
    let cancelled = false;
    getAnalyticsBrief(30)
      .then((brief) => {
        if (!cancelled) setAnalyticsContext(formatBriefAsContext(brief));
      })
      .catch(() => {
        if (!cancelled) setAnalyticsContext("Website analytics are currently unavailable.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY || ''
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || error === "sending") return;

    setError("sending");
    setProvider(null);
    setModel(null);

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // free + strong
        messages: [
          {
            role: "system",
            content: `${PARTNER_SYSTEM_PROMPT}\n\n${analyticsContext}`,
          },
          ...updatedMessages,
        ],
        temperature: 0.3,
        stream: false
      });

      const reply = response.choices?.[0]?.message?.content || 
        "I’m here — but I didn’t get a response.";

      const assistantMessage = {
        role: "assistant",
        content: reply,
        provider: "Groq",
        model: "llama-3.3-70b-versatile"
      };

      setProvider("Groq");
      setModel("llama-3.3-70b-versatile");
      setMessages((prev) => [...prev, assistantMessage]);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn’t reach Groq just now." }
      ]);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="dd-page dd-page--assistant">
      <div className="dd-assistant-header">
        DIGITALLY<span className="dd-brand-defined">DEFINED</span> AI Assistant
      </div>

      <div className="dd-assistant-body">
        {messages.map((m, i) => (
          <div key={i} className={`dd-assistant-message dd-assistant-message--${m.role}`}>
            <div className={`dd-assistant-message-bubble dd-assistant-message-bubble--${m.role}`}>
              {m.content}
            </div>

            {i === messages.length - 1 && m.role === "assistant" && (m.provider || m.model) && (
              <div className="dd-assistant-meta">
                {m.provider && <span className="dd-assistant-chip">{m.provider}</span>}
                {m.model && <span className="dd-assistant-chip">{m.model}</span>}
              </div>
            )}
          </div>
        ))}

        {provider && model && (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip">provider: {provider}</span>
            <span className="dd-assistant-chip">model: {model}</span>
          </div>
        )}

        {error && error !== "sending" && (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip dd-assistant-chip--error">error: {error}</span>
          </div>
        )}

        {error === "sending" && (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip">Thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="dd-assistant-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything…"
          className="dd-assistant-input"
        />
        <button onClick={sendMessage} className="dd-button dd-button--primary" type="button">
          Send
        </button>
      </div>
    </div>
  );
}
