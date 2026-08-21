// Social media integration service
// Supports Facebook, Instagram, YouTube, Twitter/X, LinkedIn through a backend proxy.

export async function fetchSocialStats() {
  const platforms = {
    facebook: {
      enabled: Boolean(import.meta.env.VITE_FACEBOOK_PAGE_ID),
      pageId: import.meta.env.VITE_FACEBOOK_PAGE_ID || '',
      accessToken: import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || '',
    },
    instagram: {
      enabled: Boolean(import.meta.env.VITE_INSTAGRAM_BUSINESS_ID),
      businessId: import.meta.env.VITE_INSTAGRAM_BUSINESS_ID || '',
      accessToken: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || '',
    },
    youtube: {
      enabled: Boolean(import.meta.env.VITE_YOUTUBE_CHANNEL_ID),
      channelId: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '',
      apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
    },
    twitter: {
      enabled: Boolean(import.meta.env.VITE_TWITTER_BEARER_TOKEN),
      bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN || '',
      username: import.meta.env.VITE_TWITTER_USERNAME || '',
    },
    linkedin: {
      enabled: Boolean(import.meta.env.VITE_LINKEDIN_ORG_ID),
      organizationId: import.meta.env.VITE_LINKEDIN_ORG_ID || '',
      accessToken: import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN || '',
    },
  };

  const activePlatforms = Object.entries(platforms).filter(([, config]) => config.enabled);

  if (!activePlatforms.length) {
    return {
      connected: false,
      platforms: {},
      followers: null,
      engagementRate: null,
      impressions30d: null,
      topPosts: [],
      lastUpdated: null,
      error: 'No social platforms configured',
    };
  }

  try {
    const response = await fetch('/api/integrations/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platforms: Object.fromEntries(activePlatforms) }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Social fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    return {
      connected: true,
      platforms: payload.platforms || {},
      followers: payload.followers ?? null,
      engagementRate: payload.engagementRate ?? null,
      impressions30d: payload.impressions30d ?? null,
      topPosts: Array.isArray(payload.topPosts) ? payload.topPosts.slice(0, 5) : [],
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      platforms: {},
      followers: null,
      engagementRate: null,
      impressions30d: null,
      topPosts: [],
      lastUpdated: null,
      error: error.message || 'Failed to fetch social data',
    };
  }
}

export default { fetchSocialStats };
