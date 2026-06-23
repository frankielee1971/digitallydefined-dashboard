import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      const API_URL =
        import.meta.env.VITE_HERMES_GATEWAY_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        "/api/hermes";
      const res = await fetch(`${API_URL}?action=chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY
          },
          body: JSON.stringify({
            messages: updatedMessages
          })
        }
      );

      const data = await res.json();

      const botMessage = {
        role: "assistant",
        content: data.reply || "No response received."
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error contacting server." }
      ]);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "#000",
          color: "#fff",
          padding: "14px 18px",
          borderRadius: "50%",
          fontSize: "20px",
          cursor: "pointer",
          zIndex: 9999
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            width: "320px",
            height: "420px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999
          }}
        >
          <div
            style={{
              padding: "12px",
              background: "#000",
              color: "#fff",
              fontWeight: "bold"
            }}
          >
            DigitallyDefined AI
          </div>

          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto"
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  textAlign: m.role === "user" ? "right" : "left"
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: m.role === "user" ? "#000" : "#f1f1f1",
                    color: m.role === "user" ? "#fff" : "#000"
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#000",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
