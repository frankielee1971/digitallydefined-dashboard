// lib/hermesClient.js
const HERMES_BASE_URL =
  import.meta.env.VITE_HERMES_BASE_URL ||
  import.meta.env.VITE_HERMES_GATEWAY_URL ||
  "https://digitallydefined-os-backend.vercel.app/api/hermes";

const DASHBOARD_API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";

export async function callHermes(modelKey, messages) {
  const body = {
    message: messages.find((m) => m.role === "user")?.content || "",
    messages,
    conversation: messages,
    agent: modelKey,
    agentKey: modelKey,
  };

  const res = await fetch(HERMES_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": DASHBOARD_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Hermes error (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json().catch(() => ({}));
  return typeof data?.reply === "string" && data.reply ? data.reply : "";
}
