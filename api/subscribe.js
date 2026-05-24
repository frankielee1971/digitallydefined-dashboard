export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  // 1. Get OAuth token
  const tokenRes = await fetch("https://api.sendpulse.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.SENDPULSE_CLIENT_ID,
      client_secret: process.env.SENDPULSE_CLIENT_SECRET,
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 2. Add subscriber
  const addRes = await fetch(
    `https://api.sendpulse.com/addressbooks/${process.env.SENDPULSE_ADDRESS_BOOK_ID}/emails`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        emails: [
          {
            email,
            variables: {
              source: "digitallydefined.online",
            },
          },
        ],
      }),
    }
  );

  const result = await addRes.json();
  return res.status(200).json(result);
}
