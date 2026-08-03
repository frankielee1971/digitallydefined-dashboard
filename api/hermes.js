// Vercel Serverless Function: /api/hermes
// Proxies to Supabase Edge Function
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  const EDGE_URL = 'https://dijjlppdljpcgyoakdnq.supabase.co/functions/v1/hermes';
  const API_KEY = process.env.VITE_DASHBOARD_API_KEY || '';

  try {
    const body = req.method === 'POST' ? req.body : {};
    const response = await fetch(EDGE_URL, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: req.method === 'POST' ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Request failed', message: error.message });
  }
}
