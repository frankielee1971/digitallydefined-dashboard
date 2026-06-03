export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey) {
    return res.status(500).json({ error: "Brevo API key not configured" });
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "api-key": apiKey.trim(),
    };

    // Add subscriber to Brevo list
    const body = {
      email,
      listIds: listId ? [parseInt(listId, 10)] : [],
      attributes: {
        SOURCE: "digitallydefined.online",
      },
    };

    console.log('[Brevo] Adding subscriber:', email);
    console.log('[Brevo] Request body:', JSON.stringify(body));

    const addRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log('[Brevo] Response status:', addRes.status);
    const result = await addRes.json();
    console.log('[Brevo] Response body:', JSON.stringify(result));

    if (!addRes.ok) {
      const errorMsg = result?.message || 'Brevo subscription failed';
      console.error('[Brevo] Error:', errorMsg, '| status:', addRes.status);
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
    console.error('[Brevo] Subscribe failed:', err.message);
    return res.status(500).json({
      error: 'Subscription failed',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
}
