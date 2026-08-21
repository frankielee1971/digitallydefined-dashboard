// Community integration service
// Supports Facebook Groups, Discord, Mighty Networks through backend proxy.

export async function fetchCommunityStats() {
  const platform = import.meta.env.VITE_COMMUNITY_PLATFORM || 'facebook';
  const facebookGroupId = import.meta.env.VITE_FACEBOOK_GROUP_ID;
  const discordBotToken = import.meta.env.VITE_DISCORD_BOT_TOKEN;
  const mightyNetworksApiKey = import.meta.env.VITE_MIGHTY_NETWORKS_API_KEY;

  const hasFacebook = Boolean(facebookGroupId);
  const hasDiscord = Boolean(discordBotToken);
  const hasMightyNetworks = Boolean(mightyNetworksApiKey);

  if (!hasFacebook && !hasDiscord && !hasMightyNetworks) {
    return {
      connected: false,
      platform: null,
      members: null,
      activeToday: null,
      growth30d: null,
      topMembers: [],
      lastUpdated: null,
      error: 'No community platform configured',
    };
  }

  try {
    const response = await fetch('/api/integrations/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, hasFacebook, hasDiscord, hasMightyNetworks }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Community fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    return {
      connected: true,
      platform,
      members: payload.members ?? null,
      activeToday: payload.activeToday ?? null,
      growth30d: payload.growth30d ?? null,
      topMembers: Array.isArray(payload.topMembers) ? payload.topMembers.slice(0, 5) : [],
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      platform,
      members: null,
      activeToday: null,
      growth30d: null,
      topMembers: [],
      lastUpdated: null,
      error: error.message || 'Failed to fetch community data',
    };
  }
}

export default { fetchCommunityStats };
