import { useState } from "react";

export default function ChatWidget({ dashboardSnapshot }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey. I'm Hermes — the AI guide inside DigitallyDefined.\n\nI'm here to help you figure out which digital income path actually fits your experience, your lifestyle, and your season of life.\n\nNo camera required. No hustle. No guesswork.\n\nYou can ask me anything — or if you want a fast answer, tell me one of these:\n• What is digital real estate?\n• Which path is right for me?\n• What is a digital superpower?\n• How does DigitallyDefined work?\n\nOr just ask what's on your mind. I've got you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() || error === "sending") return;
    setError("sending");

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      const API_URL = "/api/hermes";
      const context = dashboardSnapshot && typeof dashboardSnapshot === 'object'
        ? {
            stats: dashboardSnapshot.stats || dashboardSnapshot.metrics || null,
            lastSync: dashboardSnapshot.lastSync || null,
            sourceHealth: dashboardSnapshot.sourceHealth || null,
            alerts: Array.isArray(dashboardSnapshot.alerts) ? dashboardSnapshot.alerts.slice(0, 5) : [],
            reviews: Array.isArray(dashboardSnapshot.reviews) ? dashboardSnapshot.reviews.slice(0, 5) : [],
            campaigns: Array.isArray(dashboardSnapshot.campaigns) ? dashboardSnapshot.campaigns.slice(0, 5) : [],
            automations: Array.isArray(dashboardSnapshot.automations) ? dashboardSnapshot.automations.slice(0, 5) : [],
          }
        : {};

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || "",
        },
        body: JSON.stringify({
          message: input.trim(),
          messages: updatedMessages,
          context,
          conversation: updatedMessages,
          agent: "digitallydefined_partner",
        }),
      });

      const text = await res.text();
      const data = res.headers.get("content-type")?.includes("application/json")
        ? (() => { try { return JSON.parse(text); } catch { return null; } })()
        : null;

      if (!res.ok) {
        const providerError = data?.error || data?.message || `Request failed with status ${res.status}`;
        const snippet = text?.slice(0, 200);
        throw new Error(snippet ? `${providerError} - ${snippet}` : providerError);
      }

      if (!data) {
        throw new Error("Unexpected non-JSON response from Hermes backend.");
      }

      const botMessage = {
        role: "assistant",
        content: typeof data?.reply === 'string' && data.reply ? data.reply : "I didn’t get a response from Hermes.",
        provider: data?.provider || null,
        model: data?.model || null,
        agent: data?.agent || null,
        notebookLm: data?.notebookLm || null,
        brandTokens: data?.brandTokens || null,
        dashboardContext: data?.dashboardContext || null,
      };

      setMessages((prev) => [...prev, botMessage]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while reaching Hermes.");
      setMessages((prev) => [...prev, { role: "assistant", content: "I couldn’t reach Hermes just now." }]);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="dd-chat-toggle">
        💬
      </button>

      {open && (
        <div className="dd-chat-window">
          <div className="dd-chat-header">DigitallyDefined AI</div>

          <div className="dd-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`dd-chat-message dd-chat-message--${m.role}`}>
                <div className="dd-chat-bubble">{m.content}</div>
                {i === messages.length - 1 && m.role === "assistant" ? (
                  <div className="dd-chat-meta">
                    {m.provider ? <span className="dd-chat-chip">{m.provider}</span> : null}
                    {m.model ? <span className="dd-chat-chip">{m.model}</span> : null}
                    {m.agent ? <span className="dd-chat-chip">agent: {m.agent}</span> : null}
                    {m.notebookLm?.applied ? <span className="dd-chat-chip">notebookLM: applied</span> : null}
                    {m.brandTokens?.applied ? <span className="dd-chat-chip">brandTokens: applied</span> : null}
                    {m.dashboardContext?.applied ? <span className="dd-chat-chip">dashboardContext: applied</span> : null}
                  </div>
                ) : null}
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
            <button onClick={sendMessage} className="dd-button dd-button--primary" type="button">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
