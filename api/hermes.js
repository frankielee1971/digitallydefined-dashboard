// Website Hermes - Mentor for Gen X Women
// URL: https://digitallydefined.online/api/hermes
// Purpose: Dashboard API Gateway

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://dashboard.digitallydefined.online';
const API_KEY = process.env.DASHBOARD_API_KEY;

export default async function handler(req, res) {
  // ✅ CORS - Allow specific origin with credentials
  const origin = req.headers.origin || req.headers.Origin || '';
  
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed for actual requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate API key
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== API_KEY) {
    console.error('[Hermes Gateway] Unauthorized: Invalid or missing API key');
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }

  try {
    // Parse the request body
    let body = {};
    try {
      body = req.body || (req.method === 'POST' ? JSON.parse(JSON.stringify(req.body)) : {});
    } catch (e) {
      body = req.body || {};
    }

    // Handle different actions
    const action = body.action;
    
    // Return success response
    return res.status(200).json({
      status: "success",
      reply: "Hermes Gateway is active and authenticated",
      action: action,
      environment: "dashboard",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Hermes Gateway] Error:', error.message);
    return res.status(500).json({
      status: "error",
      error: error.message || "Gateway error"
    });
  }
}
