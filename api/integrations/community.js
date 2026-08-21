// Vercel Serverless Function: /api/integrations/community
// Proxies community platform data requests to backend logic.
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

  const { platform, hasFacebook, hasDiscord, hasMightyNetworks } = req.body || {};

  if (!platform || (!hasFacebook && !hasDiscord && !hasMightyNetworks)) {
    return res.status(400).json({ error: 'No community platform available' });
  }

  try {
    // Placeholder: in production, call the selected provider's API with stored credentials.
    const data = {
      members: 1284,
      activeToday: 96,
      growth30d: 0.082,
      topMembers: [
        { name: 'Rena Walker', joinedAt: '2026-03-28', status: 'Active' },
        { name: 'Angela Brooks', joinedAt: '2026-03-31', status: 'Onboarding' },
        { name: 'Tasha Monroe', joinedAt: '2026-04-02', status: 'Subscribed' },
        { name: 'Nicole James', joinedAt: '2026-04-04', status: 'Engaged' },
      ],
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Community fetch failed', message: error.message });
  }
}
