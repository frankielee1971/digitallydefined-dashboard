import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_DASHBOARD_API_URL || "https://digitallydefined-os-backend.vercel.app/api";
const BACKEND_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";

export default function HermesWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/hermes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(BACKEND_KEY ? { "x-api-key": BACKEND_KEY } : {}),
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Hermes request failed");
      }

      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Hermes Widget Error:", err);
      setError(err.message || "Failed to connect to Hermes");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't reach Hermes. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Bubble */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#111",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999,
          fontSize: "28px",
        }}
      >
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "24px",
            width: "340px",
            height: "480px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#111",
              color: "#fff",
              padding: "14px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Hermes — Your Digital Business Guide
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              background: "#f7f7f7",
            }}
          >
            {error && (
              <div
                style={{
                  marginBottom: "12px",
                  color: "#d32f2f",
                  fontSize: "14px",
                  padding: "8px",
                  background: "rgba(211,47,47,0.1)",
                  borderRadius: "8px",
                }}
              >
                {error}
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background:
                      msg.role === "user" ? "#111" : "rgba(0,0,0,0.07)",
                    color: msg.role === "user" ? "#fff" : "#111",
                    maxWidth: "80%",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ opacity: 0.6, fontStyle: "italic" }}>
                Hermes is thinking…
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Hermes anything…"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 14px",
                background: "#111",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
