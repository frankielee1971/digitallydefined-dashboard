import { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import { ddBrand, ddSection, ddContainer } from "../brand/dd-brand-tokens";
import FadeInSection from "../components/FadeInSection";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your DigitallyDefined assistant. What should we move on next?" }
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [model, setModel] = useState(null);
  const messagesEndRef = useRef(null);

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || ''
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
        model: "llama-3.3-70b-versatile",
        messages: updatedMessages,
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
    <div
      style={{
        minHeight: "100vh",
        background: ddBrand.tokens.background,
        color: ddBrand.tokens.text,
        fontFamily: ddBrand.typography.body.fontFamily,
      }}
    >
      <FadeInSection>
        <div
          style={{
            ...ddBrand.card,
            margin: `${ddSection.padding?.split(' ')[0] || '44px'} auto`,
            width: ddContainer.width || "min(100% - 48px, 1100px)",
            maxWidth: ddContainer.width || "1100px",
            minHeight: "80vh",
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              ...ddBrand.card,
              background: ddBrand.tokens.aquaBlue,
              color: ddBrand.tokens.textDark,
              borderBottom: ddBrand.border,
              fontFamily: ddBrand.typography.heading.fontFamily,
              fontWeight: 800,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span>
              DIGITALLY<span style={{ color: ddBrand.tokens.orange }}>DEFINED</span> AI Assistant
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.75,
              }}
            >
              {provider ? `${provider} · ${model}` : "Online"}
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              ...ddBrand.card,
              background: ddBrand.tokens.background,
              border: "none",
              borderBottom: ddBrand.border,
              overflowY: "auto",
              display: "grid",
              gap: "14px",
              padding: "20px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 14px",
                    border: ddBrand.border,
                    background: m.role === "user" ? ddBrand.tokens.aquaBlue : ddBrand.tokens.surface,
                    color: m.role === "user" ? ddBrand.tokens.textDark : ddBrand.tokens.text,
                    lineHeight: 1.4,
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {m.content}

                  {i === messages.length - 1 && m.role === "assistant" && (m.provider || m.model) && (
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {m.provider && (
                        <span
                          style={{
                            ...ddBrand.typography.eyebrow,
                            fontSize: "0.62rem",
                            padding: "4px 8px",
                            border: ddBrand.border,
                            background: ddBrand.tokens.surface,
                          }}
                        >
                          {m.provider}
                        </span>
                      )}
                      {m.model && (
                        <span
                          style={{
                            ...ddBrand.typography.eyebrow,
                            fontSize: "0.62rem",
                            padding: "4px 8px",
                            border: ddBrand.border,
                            background: ddBrand.tokens.surface,
                          }}
                        >
                          {m.model}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {provider && model && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    ...ddBrand.typography.eyebrow,
                    fontSize: "0.62rem",
                    padding: "4px 8px",
                    border: ddBrand.border,
                    background: ddBrand.tokens.surface,
                  }}
                >
                  provider: {provider}
                </span>
                <span
                  style={{
                    ...ddBrand.typography.eyebrow,
                    fontSize: "0.62rem",
                    padding: "4px 8px",
                    border: ddBrand.border,
                    background: ddBrand.tokens.surface,
                  }}
                >
                  model: {model}
                </span>
              </div>
            )}

            {error && error !== "sending" && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    ...ddBrand.typography.eyebrow,
                    fontSize: "0.62rem",
                    padding: "4px 8px",
                    border: ddBrand.border,
                    background: ddBrand.tokens.danger || ddBrand.tokens.darkRed,
                    color: ddBrand.tokens.background,
                  }}
                >
                  error: {error}
                </span>
              </div>
            )}

            {error === "sending" && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    ...ddBrand.typography.eyebrow,
                    fontSize: "0.62rem",
                    padding: "4px 8px",
                    border: ddBrand.border,
                    background: ddBrand.tokens.surface,
                  }}
                >
                  Thinking…
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              ...ddBrand.card,
              border: "none",
              borderTop: ddBrand.border,
              display: "flex",
              gap: "12px",
              padding: "16px 20px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything…"
              className="dd-input"
              style={{ flex: 1, minWidth: "180px" }}
            />
            <button
              onClick={sendMessage}
              style={{
                ...brutalButtonPrimary,
                padding: '12px 20px',
                transition: 'transform 0.2s ease, filter 0.2s ease',
              }}
              type="button"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.filter = 'brightness(0.96)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              Send
            </button>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
