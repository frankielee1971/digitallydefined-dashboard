import { useState, useEffect, useRef } from "react";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi Francesca! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          body: JSON.stringify({ messages: updatedMessages })
        }
      );

      const data = await res.json();

      const botMessage = {
        role: "assistant",
        content: data.reply || "I’m here — but I didn’t get a response from the server."
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f7f7f7"
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          background: "#000",
          color: "#fff",
          fontSize: "20px",
          fontWeight: "bold"
        }}
      >
        DigitallyDefined AI Assistant
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: "14px",
              textAlign: m.role === "user" ? "right" : "left"
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "10px",
                background: m.role === "user" ? "#000" : "#eaeaea",
                color: m.role === "user" ? "#fff" : "#000",
                maxWidth: "80%",
                lineHeight: "1.4"
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          gap: "10px",
          background: "#fff",
          borderTop: "1px solid #ddd"
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#000",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
