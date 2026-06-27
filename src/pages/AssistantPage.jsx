import { useState, useEffect, useRef } from "react";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm connected to Hermes. What should we move on next?" }
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [model, setModel] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || error === "sending") return;
    setError("sending");
    setProvider(null);
    setModel(null);

    const userMessage = { role: "user", content: input.trim() };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");

    try {
      const res = await fetch("/api/hermes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || ""
        },
      body: JSON.stringify({
        action: "hermes",
        message: input.trim(),
        messages: updated,
        context: {},
        conversation: updated,
      }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      const assistant = {
        role: "assistant",
        content: typeof data?.reply === "string" && data.reply ? data.reply : "I’m here — but I didn’t get a response from the server.",
        provider: data?.provider || null,
        model: data?.model || null,
      };
      setProvider(assistant.provider);
      setModel(assistant.model);
      setMessages((prev) => [...prev, assistant]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while reaching Hermes.");
      setMessages((prev) => [...prev, { role: "assistant", content: "I couldn’t reach the backend just now." }]);
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
      <div className="dd-assistant-header">DigitallyDefined AI Assistant</div>

      <div className="dd-assistant-body">
        {messages.map((m, i) => (
          <div key={i} className={`dd-assistant-message dd-assistant-message--${m.role}`}>
            <div className={`dd-assistant-message-bubble dd-assistant-message-bubble--${m.role}`}>
              {m.content}
            </div>
            {i === messages.length - 1 && m.role === "assistant" && (m.provider || m.model) ? (
              <div className="dd-assistant-meta">
                {m.provider ? <span className="dd-assistant-chip">{m.provider}</span> : null}
                {m.model ? <span className="dd-assistant-chip">{m.model}</span> : null}
              </div>
            ) : null}
          </div>
        ))}

        {provider && model ? (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip">provider: {provider}</span>
            <span className="dd-assistant-chip">model: {model}</span>
          </div>
        ) : null}

        {error && error !== "sending" ? (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip dd-assistant-chip--error">error: {error}</span>
          </div>
        ) : null}

        {error === "sending" ? (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip">Hermes is thinking…</span>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      <div className="dd-assistant-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask Hermes anything…"
          className="dd-assistant-input"
        />
        <button onClick={sendMessage} className="dd-button dd-button--primary" type="button">
          Send
        </button>
      </div>
    </div>
  );
}
