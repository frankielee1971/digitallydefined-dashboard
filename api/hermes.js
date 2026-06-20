/**
 * Hermes Handler - Proxy all requests to backend
 * All requests (including chat) are proxied to the backend /api/hermes endpoint
 */

export default async function handler(req, res) {
  // === CORS Configuration ===
  const allowedOrigins = [
    'https://dashboard.digitallydefined.online',
    'https://digitallydefined.online',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  const origin = req.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin)
    ? origin
    : 'https://dashboard.digitallydefined.online';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  // === Preflight ===
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // === Method Validation ===
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // === API Key Validation ===
  const provided = req.headers['x-api-key'] || '';
  const expected = (process.env.DASHBOARD_API_KEY || process.env.VITE_DASHBOARD_API_KEY || '').trim();

  if (!expected || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });
  }

  try {
    // === Parse Request Body ===
    const body = req.body || {};
    
    // Ensure body is an object
    if (typeof body !== 'object' || body === null) {
      return res.status(400).json({ 
        error: 'Invalid request body - must be JSON object' 
      });
    }

    const action = typeof body.action === 'string' ? body.action : '';

    // === Proxy ALL requests to Backend ===
    // All requests (actions and chat) are proxied to the backend /api/hermes endpoint
    const hermesEndpoint = (process.env.HERMES_BACKEND_URL || 'https://digitallydefined-os-backend.vercel.app').replace(/\/$/, '');
    const backendUrl = body.action 
      ? `${hermesEndpoint}/api?action=${encodeURIComponent(body.action)}`
      : `${hermesEndpoint}/api/hermes`;
    
    const { action: _action, ...payload } = body;

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': expected,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        return res.status(response.status || 500).json({
          error: 'Backend returned non-JSON output',
          detail: text.slice(0, 500),
          status: response.status
        });
      }

      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.error || data?.message || 'Backend request failed',
          detail: text.slice(0, 500),
          status: response.status
        });
      }

      return res.status(200).json(data);
    } catch (proxyError) {
      console.error('[Hermes] Proxy error:', proxyError);
      return res.status(502).json({
        error: 'Backend service unreachable',
        detail: proxyError?.message || 'Failed to connect to backend'
      });
    }

  } catch (error) {
    console.error('[Hermes] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      detail: error?.message || 'Unknown error'
    });
  }
}
