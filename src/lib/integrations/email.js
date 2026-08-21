// Email list integration service
// Supports Brevo, Mailchimp through backend proxy.

export async function fetchEmailStats() {
  const provider = import.meta.env.VITE_EMAIL_PROVIDER || 'brevo';
  const brevoApiKey = import.meta.env.VITE_BREVO_API_KEY;
  const mailchimpApiKey = import.meta.env.VITE_MAILCHIMP_API_KEY;

  const hasBrevo = Boolean(brevoApiKey);
  const hasMailchimp = Boolean(mailchimpApiKey);

  if (!hasBrevo && !hasMailchimp) {
    return {
      connected: false,
      provider: null,
      subscribers: null,
      openRate: null,
      clickRate: null,
      campaigns: [],
      revenuePerCampaign: null,
      lastUpdated: null,
      error: 'No email provider configured',
    };
  }

  try {
    const response = await fetch('/api/integrations/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, hasBrevo, hasMailchimp }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Email fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    return {
      connected: true,
      provider,
      subscribers: payload.subscribers ?? null,
      openRate: payload.openRate ?? null,
      clickRate: payload.clickRate ?? null,
      campaigns: Array.isArray(payload.campaigns) ? payload.campaigns.slice(0, 5) : [],
      revenuePerCampaign: payload.revenuePerCampaign ?? null,
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      provider,
      subscribers: null,
      openRate: null,
      clickRate: null,
      campaigns: [],
      revenuePerCampaign: null,
      lastUpdated: null,
      error: error.message || 'Failed to fetch email data',
    };
  }
}

export default { fetchEmailStats };
