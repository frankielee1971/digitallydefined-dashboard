// src/lib/integrations.js
// DigitallyDefined Dashboard — Integration data fetchers
// Each function returns a normalized shape. Connect real API calls here
// once OAuth tokens are wired. Stubs return { connected: false } so the UI
// renders gracefully without crashing.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dijjlppdljpcgyoakdnq.supabase.co';
const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || '';

async function callHermes(action, payload = {}) {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/hermes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ action, ...payload }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`Hermes ${action} failed: ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn(`[integrations] ${action} unavailable:`, err.message);
    return null;
  }
}

/**
 * Google Analytics integration stub.
 * Replace the body with real GA4 Data API calls once credentials are wired.
 */
export async function fetchGoogleAnalytics() {
  // Future: call Hermes with action "integration.googleAnalytics"
  // For now: return disconnected shape so the UI renders correctly.
  const result = await callHermes('integration.googleAnalytics');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    propertyId: result.data.propertyId || null,
    users30d: result.data.users30d ?? null,
    sessions30d: result.data.sessions30d ?? null,
    revenue30d: result.data.revenue30d ?? null,
    bounceRate: result.data.bounceRate ?? null,
    goalConversions: result.data.goalConversions ?? null,
    error: null,
  };
}

/**
 * Social pages integration stub.
 * Replace with real Meta/Instagram Graph API calls.
 */
export async function fetchSocialStats() {
  const result = await callHermes('integration.social');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    followers: result.data.followers ?? null,
    engagementRate: result.data.engagementRate ?? null,
    impressions30d: result.data.impressions30d ?? null,
    error: null,
  };
}

/**
 * Email list integration stub.
 * Replace with Brevo/Mailchimp API calls.
 */
export async function fetchEmailStats() {
  const result = await callHermes('integration.email');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    provider: result.data.provider || null,
    subscribers: result.data.subscribers ?? null,
    openRate: result.data.openRate ?? null,
    clickRate: result.data.clickRate ?? null,
    revenuePerCampaign: result.data.revenuePerCampaign ?? null,
    error: null,
  };
}

/**
 * Community integration stub.
 * Replace with Facebook Groups API or Circle/Skool API calls.
 */
export async function fetchCommunityStats() {
  const result = await callHermes('integration.community');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    platform: result.data.platform || null,
    members: result.data.members ?? null,
    activeToday: result.data.activeToday ?? null,
    growth30d: result.data.growth30d ?? null,
    error: null,
  };
}