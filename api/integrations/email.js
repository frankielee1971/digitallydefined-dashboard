// Vercel Serverless Function: /api/integrations/email
// Proxies email provider data requests to backend logic.
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

  const { provider, hasBrevo, hasMailchimp } = req.body || {};

  if (!provider || (!hasBrevo && !hasMailchimp)) {
    return res.status(400).json({ error: 'No email provider available' });
  }

  try {
    // Placeholder: in production, call Brevo or Mailchimp API with stored credentials.
    const data = {
      subscribers: 3120,
      openRate: 0.282,
      clickRate: 0.114,
      campaigns: [
        { name: 'Authority Launch Sequence', openRate: 0.312, clickRate: 0.128 },
        { name: 'Evergreen Reputation Funnel', openRate: 0.264, clickRate: 0.104 },
        { name: 'Reinvention Reactivation', openRate: 0.298, clickRate: 0.118 },
      ],
      revenuePerCampaign: 1280,
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Email fetch failed', message: error.message });
  }
}
