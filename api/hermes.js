/**
 * Frontend Hermes proxy
 *
 * Forwards chat requests from landing page and dashboard pages to the
 * backend Hermes endpoint and returns backend JSON unchanged while
 * keeping CORS under our own origin.
 */

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://dashboard.digitallydefined.online',
    'https://digitallydefined.online',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://dashboard.digitallydefined.online');
  }
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true, status: 'Hermes backend is running' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed - use POST', reply: '' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const provided = String(req.headers['x-api-key'] || req.headers['authorization'] || '').trim();
  const expected = String(process.env.DASHBOARD_API_KEY || process.env.VITE_DASHBOARD_API_KEY || '').trim();
  if (!expected || provided !== expected) return res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });

  let body = {};
  if (typeof req.body === 'string') {
    try { body = JSON.parse(req.body); } catch { body = {}; }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body;
  }

  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid request body - must be JSON object' });

  const backendUrl = `${(process.env.HERMES_BACKEND_URL || 'https://digitallydefined-os-backend.vercel.app').replace(/\/$/, '')}/api/hermes`;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': expected,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45000),
    });

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    let parsed;
    if (contentType.includes('application/json')) {
      try { parsed = JSON.parse(text); } catch { parsed = { reply: text }; }
    } else {
      parsed = { reply: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: parsed?.error || parsed?.message || 'Backend request failed', status: response.status });
    }

    return res.status(200).json(parsed);
  } catch (proxyError) {
    console.error('[Hermes] Proxy error:', proxyError);
    return res.status(502).json({ error: 'Backend service unreachable', detail: proxyError?.message || 'Failed to connect to backend' });
  }
}
