import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  async sendMessage() {
    if (!input.trim() || error === "sending") return;
    setError("sending");

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      const API_URL = import.meta.env.VITE_DASHBOARD_HERMES_URL ||
        "https://digitallydefined-os-backend.vercel.app/api/hermes";
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || "",
        },
        body: JSON.stringify({
          message: input.trim(),
          messages: updatedMessages,
          context: {},
          conversation: updatedMessages,
        }),
      });

      const text = await res.text();
      const data = res.headers.get("content-type")?.includes("application/json")
        ? (() => { try { return JSON.parse(text); } catch { return null; } })()
        : null;

      if (!res.ok) {
        const providerError = data?.providerError || data?.error || `Request failed with status ${res.status}`;
        const snippet = text?.slice(0, 200);
        throw new Error(snippet ? `${providerError} - ${snippet}` : providerError);
      }

      if (!data) {
        throw new Error("Unexpected non-JSON response from Hermes.");
      }

      const botMessage = {
        role: "assistant",
        content: typeof data?.reply === "string" && data.reply ? data.reply : "No response received.",
        provider: data?.provider || null,
        model: data?.model || null,
      };

      setMessages((prev) => [...prev, botMessage]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while reaching Hermes.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error contacting server." },
      ]);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="dd-chat-toggle"
      >
        💬
      </button>

      {open && (
        <div className="dd-chat-window">
          <div className="dd-chat-header">DigitallyDefined AI</div>

          <div className="dd-chat-body">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`dd-chat-message dd-chat-message--${m.role}`}
              >
                <div className="dd-chat-bubble">
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="dd-chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              className="dd-chat-input"
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
      )}
    </>
  );
}
