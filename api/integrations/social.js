// Vercel Serverless Function: /api/integrations/social
// Proxies social media data requests to backend logic.
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

  const { platforms } = req.body || {};

  if (!platforms || typeof platforms !== 'object') {
    return res.status(400).json({ error: 'Missing platforms payload' });
  }

  try {
    const platformEntries = Object.entries(platforms || {});

    if (!platformEntries.length) {
      return res.status(200).json({
        connected: false,
        platforms: {},
        followers: null,
        engagementRate: null,
        impressions30d: null,
        topPosts: [],
      });
    }

    // Placeholder: in production, call each provider's API with credentials.
    const aggregated = {
      connected: true,
      platforms: Object.fromEntries(platformEntries.map(([name]) => [name, { connected: true }])),
      followers: 4820,
      engagementRate: 0.038,
      impressions30d: 28400,
      topPosts: [
        { platform: 'facebook', title: 'Reinventing Your Digital Career', impressions: 4200 },
        { platform: 'instagram', title: 'Morning Brand Check-In', impressions: 3100 },
        { platform: 'youtube', title: 'How I Built an Automated Funnel', impressions: 2600 },
      ],
    };

    return res.status(200).json(aggregated);
  } catch (error) {
    return res.status(500).json({ error: 'Social fetch failed', message: error.message });
  }
}
