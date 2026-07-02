/**
 * Hermes Guide Generation API Route
 *
 * Generates personalized guides from quiz/profile answers using structured outputs.
 * Calls the Hermes backend with a JSON schema to ensure parseable responses.
 *
 * POST /api/hermes-guide
 * Headers: x-api-key (required)
 * Body: {
 *   resultKey?: string,
 *   resultTitle?: string,
 *   answers?: object,
 *   contact?: { name?: string, email?: string },
 *   profile?: object
 * }
 *
 * Returns: { guide: { title, summary, firstAsset, firstSteps, recommendedPath, nextMilestone, encouragement } }
 */

import { hermesSystemPrompt } from "../src/lib/hermes/systemPrompt.js";
import { guideSchema } from "../src/lib/hermes/guideSchema.js";
import { buildGuideInput } from "../src/lib/hermes/buildGuideInput.js";

export default async function handler(req, res) {
  // CORS headers (matching existing api/hermes.js pattern)
  const allowedOrigins = [
    "https://dashboard.digitallydefined.online",
    "https://digitallydefined.online",
    "http://localhost:3000",
    "http://localhost:5173",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://dashboard.digitallydefined.online");
  }
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed - use POST" });

  // Auth check (matching existing pattern)
  const provided = String(req.headers["x-api-key"] || req.headers["authorization"] || "").trim();
  const expected = String(process.env.DASHBOARD_API_KEY || process.env.VITE_DASHBOARD_API_KEY || "").trim();
  if (!expected || provided !== expected) {
    return res.status(401).json({ error: "Unauthorized - Invalid or missing API key" });
  }

  // Parse and normalize input
  let body = {};
  if (typeof req.body === "string") {
    try { body = JSON.parse(req.body); } catch { body = {}; }
  } else if (req.body && typeof req.body === "object") {
    body = req.body;
  }

  const context = buildGuideInput(body);

  // Validate we have at least a result key or answers
  if (!context.resultKey && Object.keys(context.answers).length === 0) {
    return res.status(400).json({
      error: "Bad request - provide at least resultKey or answers",
      example: {
        resultKey: "creator",
        resultTitle: "The Content Creator",
        answers: { "1": "creator", "2": "creator" },
        contact: { name: "Jane", email: "jane@example.com" }
      }
    });
  }

  // Prepare request to Hermes backend
  const backendUrl = process.env.VITE_HERMES_GATEWAY_URL || "https://digitallydefined-os-backend.vercel.app/api/hermes";

  const systemPrompt = hermesSystemPrompt(context);

  const backendBody = {
    action: "hermes-guide",
    agent: "digitallydefined_guide",
    message: `Generate a personalized guide for quiz result: ${context.resultTitle || context.resultKey || "unknown"}`,
    systemPrompt,
    schema: guideSchema,
    structuredOutput: true,
    context: {
      quiz: {
        resultKey: context.resultKey,
        resultTitle: context.resultTitle,
        answers: context.answers,
        contact: context.contact,
      },
      source: "digitallydefined.quiz.guide",
    },
  };

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": expected,
      },
      body: JSON.stringify(backendBody),
      signal: AbortSignal.timeout(60000),
    });

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    let parsed;
    if (contentType.includes("application/json")) {
      try {
        parsed = JSON.parse(text);
      } catch {
        return res.status(502).json({
          error: "Backend returned invalid JSON",
          providerError: text.slice(0, 200),
        });
      }
    } else {
      return res.status(502).json({
        error: "Backend returned non-JSON response",
        providerError: text.slice(0, 200),
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: parsed?.error || parsed?.message || "Backend request failed",
        status: response.status,
        providerError: parsed?.providerError || text.slice(0, 200),
      });
    }

    // Try to extract guide from response
    // Backend may return { guide: {...} } or { reply: "..." } or direct object
    let guide = parsed?.guide || parsed?.output || parsed;

    // If backend returned a string, try to parse it as JSON
    if (typeof guide === "string") {
      try {
        guide = JSON.parse(guide);
      } catch {
        return res.status(502).json({
          error: "Failed to parse guide from backend response",
          providerError: guide.slice(0, 200),
        });
      }
    }

    // Validate guide has required fields
    if (!guide || typeof guide !== "object" || !guide.title) {
      return res.status(502).json({
        error: "Backend returned incomplete guide",
        guide: guide || null,
      });
    }

    return res.status(200).json({ guide });
  } catch (proxyError) {
    console.error("[Hermes Guide] Proxy error:", proxyError);
    return res.status(502).json({
      error: "Backend service unreachable",
      detail: proxyError?.message || "Failed to connect to backend",
    });
  }
}