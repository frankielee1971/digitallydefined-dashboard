import { useState, useEffect, useRef } from "react";
import CONFIG from "../config";

export default function AssistantPage({ dashboardSnapshot }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm connected to Hermes. What should we move on next?" }
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  const AGENTS = [
    {
      key: "digitallydefined_partner",
      label: "DigitallyDefined Partner",
      description: "Business Partner grounded in NotebookLM, brand rules, and money-gap analysis.",
    },
    { key: "default", label: "Default", description: "General Hermes OS assistant." },
  ];
  const [agentKey, setAgentKey] = useState(AGENTS[0].key);

  const [provider, setProvider] = useState(null);
  const [model, setModel] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildContext = () => {
    const base = {};

    if (dashboardSnapshot && typeof dashboardSnapshot === 'object') {
      base.stats = dashboardSnapshot.stats || dashboardSnapshot.metrics || null;
      base.lastSync = dashboardSnapshot.lastSync || null;
      base.sourceHealth = dashboardSnapshot.sourceHealth || null;
      base.alerts = Array.isArray(dashboardSnapshot.alerts) ? dashboardSnapshot.alerts.slice(0, 5) : [];
      base.reviews = Array.isArray(dashboardSnapshot.reviews) ? dashboardSnapshot.reviews.slice(0, 5) : [];
      base.campaigns = Array.isArray(dashboardSnapshot.campaigns) ? dashboardSnapshot.campaigns.slice(0, 5) : [];
      base.automations = Array.isArray(dashboardSnapshot.automations) ? dashboardSnapshot.automations.slice(0, 5) : [];
    }

    const brandTokens = CONFIG.aesthetic || {};
    const compactBrandTokens = {
      aesthetic: brandTokens.philosophy || null,
      typography: {
        headings: brandTokens.typography?.headings || null,
        body: brandTokens.typography?.body || null,
      },
      colors: brandTokens.tokens?.colors || null,
      geometry: brandTokens.geometry || null,
      rules: Array.isArray(brandTokens.rules) ? brandTokens.rules.slice(0, 12) : [],
    };

    return {
      ...base,
      brandTokens: compactBrandTokens,
      dashboard: {
        tabs: Array.isArray(CONFIG.dashboard?.tabs) ? CONFIG.dashboard.tabs.map((tab) => tab.id) : [],
        title: CONFIG.dashboard?.dashboardTitle || null,
      },
    };
  };

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
      const API_URL = "/api/hermes";
      const context = buildContext();

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || "",
        },
        body: JSON.stringify({
          message: input.trim(),
          messages: updated,
          context,
          conversation: updated,
          agent: agentKey,
          notebooks: [
            process.env.NOTEBOOKLM_BRAND_NOTEBOOK,
            process.env.NOTEBOOKLM_REAL_ESTATE_NOTEBOOK,
            process.env.NOTEBOOKLM_FACELESS_NOTEBOOK,
          ].filter(Boolean),
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

      const assistant = {
        role: "assistant",
        content: typeof data?.reply === "string" && data.reply ? data.reply : "I didn’t get a response from Hermes.",
        provider: data?.provider || null,
        model: data?.model || null,
        notebookLm: data?.notebookLm || null,
        brandTokens: data?.brandTokens || null,
        dashboardContext: data?.dashboardContext || null,
      };
      setProvider(assistant.provider);
      setModel(assistant.model);
      setMessages((prev) => [...prev, assistant]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while reaching Hermes.");
      setMessages((prev) => [...prev, { role: "assistant", content: "I couldn’t reach Hermes just now." }]);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const selectedAgent = AGENTS.find((item) => item.key === agentKey) || AGENTS[0];

  return (
    <div className="dd-page dd-page--assistant">
      <div className="dd-assistant-header">DigitallyDefined AI Assistant</div>

      <div className="dd-assistant-agent-row">
        <label className="dd-assistant-agent-label" htmlFor="agent-select">Agent</label>
        <select
          id="agent-select"
          value={agentKey}
          onChange={(e) => setAgentKey(e.target.value)}
          className="dd-assistant-agent-select"
        >
          {AGENTS.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="dd-assistant-agent-description">{selectedAgent.description}</span>
      </div>

      <div className="dd-assistant-body">
        {messages.map((m, i) => (
          <div key={i} className={`dd-assistant-message dd-assistant-message--${m.role}`}>
            <div className={`dd-assistant-message-bubble dd-assistant-message-bubble--${m.role}`}>
              {m.content}
            </div>
            {i === messages.length - 1 && m.role === "assistant" ? (
              <div className="dd-assistant-meta">
                {m.provider ? <span className="dd-assistant-chip">{m.provider}</span> : null}
                {m.model ? <span className="dd-assistant-chip">{m.model}</span> : null}
                {m.agent || agentKey ? <span className="dd-assistant-chip">agent: {m.agent || agentKey}</span> : null}
                {m.notebookLm?.applied ? <span className="dd-assistant-chip">notebookLM: applied</span> : null}
                {m.brandTokens?.applied ? <span className="dd-assistant-chip">brandTokens: applied</span> : null}
                {m.dashboardContext?.applied ? <span className="dd-assistant-chip">dashboardContext: applied</span> : null}
              </div>
            ) : null}
          </div>
        ))}

        {provider && model ? (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip">provider: {provider}</span>
            <span className="dd-assistant-chip">model: {model}</span>
            <span className="dd-assistant-chip">agent: {agentKey}</span>
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
