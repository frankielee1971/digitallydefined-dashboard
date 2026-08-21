// Vercel Serverless Function: /api/integrations/ga
// Proxies Google Analytics data requests to backend logic.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { measurementId, propertyId } = req.body || {};

  if (!measurementId || !propertyId) {
    return res.status(400).json({ error: 'Missing measurementId or propertyId' });
  }

  try {
    // Placeholder: in production, call Google Analytics Data API v1 here.
    const data = {
      users30d: 1240,
      sessions30d: 1860,
      bounceRate: 0.42,
      topPages: [
        { path: '/', views: 640 },
        { path: '/digital-business-os', views: 310 },
        { path: '/blog/gen-x-women-reinvention', views: 210 },
      ],
      goalConversions: 88,
      revenue30d: 4200,
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Google Analytics fetch failed', message: error.message });
  }
}
