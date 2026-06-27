// lib/hermesClient.js
const HERMES_BASE_URL =
  process.env.NEXT_PUBLIC_HERMES_BASE_URL || "http://127.0.0.1:8642/v1";

const MODEL_MAP = {
  default: { provider: "ollama", model: "qwen2.5:7b-instruct" },
  business_partner: { provider: "bluesminds", model: "deepseek-r4" },
  personal_assistant: { provider: "bluesminds", model: "gpt-4o-mini" },
  coding: { provider: "bluesminds", model: "hermes-3-coder" },
  structured_reasoning: { provider: "bluesminds", model: "hermes-3" },
  cheap_fast: { provider: "ollama", model: "qwen2.5:7b-instruct" },
  fallback: { provider: "ollama", model: "qwen2.5:7b-instruct" },
};

export async function callHermes(modelKey, messages) {
  const { provider, model } = MODEL_MAP[modelKey];

  const res = await fetch(`${HERMES_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `${provider}/${model}`,
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hermes error (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}
