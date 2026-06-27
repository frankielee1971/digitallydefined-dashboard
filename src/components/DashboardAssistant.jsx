// src/components/DashboardAssistant.jsx
import { useState } from "react";
import { callHermes } from "../../lib/hermesClient";

const MODEL_LABELS = {
  default: "Default (Qwen 2.5 7B – local)",
  business_partner: "Business Partner (DeepSeek R4)",
  personal_assistant: "Personal Assistant (GPT‑4o Mini)",
  coding: "Coding (Hermes‑3 Coder)",
  structured_reasoning: "Structured Reasoning (Hermes‑3)",
  cheap_fast: "Cheap & Fast (Qwen 2.5 7B)",
  fallback: "Fallback (Qwen 2.5 7B)",
};

export default function DashboardAssistant() {
  const [modelKey, setModelKey] = useState("default");
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await callHermes(modelKey, [
        {
          role: "system",
          content:
            "You are the DigitallyDefined dashboard assistant. Be precise and actionable.",
        },
        { role: "user", content: prompt },
      ]);

      setReply(response);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <select
        value={modelKey}
        onChange={(e) => setModelKey(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      >
        {Object.entries(MODEL_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border rounded px-2 py-1 w-full"
        rows={4}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Thinking…" : "Ask Assistant"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {reply && (
        <div className="border rounded p-3 bg-gray-50 whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  );
}
