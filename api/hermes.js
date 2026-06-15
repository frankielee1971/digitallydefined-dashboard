export default async function handler(req, res) {
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

  // CORS
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

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
    const body = req.body || {};
    const hermesEndpoint = (process.env.HERMES_BACKEND_URL || 'https://digitallydefined-os-backend.vercel.app').replace(/\/$/, '');
    const action = typeof body.action === 'string' ? body.action : '';

    // --- ACTION MODE ---
    if (action && action !== 'chat') {
      const getActions = new Set([
        'dashboard',
        'automation.list',
        'automation.logs',
        'automation.events',
        'status',
        'test-env',
        'auth.verify',
        'ai.recommendations',
        'brain.brief',
        'sheets',
      ]);

      const method = getActions.has(action) ? 'GET' : 'POST';
      const { action: _action, ...payload } = body;

      const response = await fetch(`${hermesEndpoint}/api?action=${encodeURIComponent(action)}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': expected,
        },
        ...(method === 'POST' ? { body: JSON.stringify(payload) } : {}),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        return res.status(response.status || 500).json({
          error: 'Backend returned non-JSON output.',
          detail: text.slice(0, 300)
        });
      }

      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.error || data?.message || 'Backend request failed.',
          detail: text.slice(0, 300)
        });
      }

      return res.status(200).json(data);
    }

    // --- CHAT MODE ---
    const lastMessage = Array.isArray(body.messages)
      ? [...body.messages].reverse().find((m) => m?.role === 'user')
      : null;

    const hermesBody = {
      ...body,
      message: body.message || lastMessage?.content || lastMessage?.text || '',
    };

    const response = await fetch(`${hermesEndpoint}/api/hermes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': expected,
      },
      body: JSON.stringify(hermesBody),
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
