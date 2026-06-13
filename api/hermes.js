export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://dashboard.digitallydefined.online');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key validation
  const provided = req.headers['x-api-key'] || '';
  const expected = (process.env.DASHBOARD_API_KEY || '').trim();

  if (!expected || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized - API key required' });
  }

  try {
    const body = req.body; // <-- FIXED

    const hermesEndpoint = (process.env.HERMES_BACKEND_URL || 'https://digitallydefined-os-backend.vercel.app').replace(/\/$/, '');

    const response = await fetch(`${hermesEndpoint}/api/hermes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': expected,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(response.status || 500).json({
        error: 'Hermes bridge returned non-JSON output.',
        detail: text.slice(0, 300)
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error || data?.message || 'Hermes bridge request failed.',
        detail: text.slice(0, 300)
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[Hermes Bridge] Error:', error);
    return res.status(500).json({
      error: 'Dashboard error. Try again.',
      detail: error?.message || 'Unknown error'
    });
  }
}
