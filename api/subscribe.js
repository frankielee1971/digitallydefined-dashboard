export default async function handler(req, res) {
  // ✅ CORS - Allow specific origin with credentials
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://dashboard.digitallydefined.online';
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const apiId = process.env.SENDPULSE_API_ID;
  const apiSecret = process.env.SENDPULSE_API_SECRET;

  if (!apiId || !apiSecret) {
    return res.status(500).json({ error: "SendPulse API credentials not configured" });
  }

  try {
    // Get OAuth access token
    const tokenResponse = await fetch('https://api.sendpulse.com/oauth/access_token', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: apiId,
        client_secret: apiSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('[SendPulse] Token request failed:', tokenResponse.status, errorData);
      return res.status(500).json({
        error: 'Failed to get SendPulse access token',
        details: errorData,
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[SendPulse] No access token in response:', tokenData);
      return res.status(500).json({
        error: 'Invalid SendPulse token response',
        details: tokenData,
      });
    }

    console.log('[SendPulse] Got access token');

    // Add subscriber to SendPulse address book
    const body = {
      emails: [{
        email: email,
        variables: {
          SOURCE: "digitallydefined.online",
        },
      }],
    };

    console.log('[SendPulse] Adding subscriber:', email);
    console.log('[SendPulse] Request body:', JSON.stringify(body));

    const addRes = await fetch('https://api.sendpulse.com/smtp/emails', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log('[SendPulse] Response status:', addRes.status);
    const result = await addRes.json();
    console.log('[SendPulse] Response body:', JSON.stringify(result));

    if (!addRes.ok) {
      const errorMsg = result?.message || 'SendPulse subscription failed';
      console.error('[SendPulse] Error:', errorMsg, '| status:', addRes.status);
      return res.status(addRes.status || 500).json({
        error: errorMsg,
        details: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription successful',
      data: result,
    });
  } catch (err) {
    console.error('[SendPulse] Subscribe failed:', err.message);
    return res.status(500).json({
      error: 'Subscription failed',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
}
