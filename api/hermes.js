// Website Hermes - Mentor for Gen X Women
// URL: https://digitallydefined.online/api/hermes
// Purpose: Public-facing mentor, NO Notion access

export default async function handler(req, res) {
  // ✅ CORS - Allow all (public)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only GET and POST allowed
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return gateway status (NO Notion access - public safe)
    return res.status(200).json({
      status: "Hermes Gateway active",
      notion: "public_mode",
      environment: "website",
      role: "Mentor for Gen X Women",
      access: "public_safe"
    });
  } catch (error) {
    console.error('[Hermes Gateway] Error:', error.message);
    return res.status(500).json({
      status: "error",
      error: error.message || "Gateway error"
    });
  }
}
