export async function sendSlackAlert({ sentiment, draft_response, internal_note }) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const message = {
    text: `🌟 *New Review Alert*\nSentiment: ${sentiment}\nDraft Response: ${draft_response}\nInternal Note: ${internal_note}`,
  };

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
}

