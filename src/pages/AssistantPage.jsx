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
        "https://digitallydefined-os-backend.vercel.app/api/hermes";
      const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || ""
          },
          body: JSON.stringify({
            message: input.trim(),
            context: {},
            conversation: updatedMessages,
          })
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
    <div className="dd-page dd-page--assistant">
      {/* Header */}
      <div className="dd-assistant-header">DigitallyDefined AI Assistant</div>

      {/* Messages */}
      <div className="dd-assistant-body">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`dd-assistant-message dd-assistant-message--${m.role}`}
          >
            <div
              className={`dd-assistant-message-bubble dd-assistant-message-bubble--${m.role}`}
            >
              {m.content}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="dd-assistant-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="dd-assistant-input"
        />
        <button
          onClick={sendMessage}
          className="dd-button dd-button--primary"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
