// Shared integration helpers and normalized data contract

export const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizePercent = (value, fallback = '0%') => {
  if (typeof value === 'string' && value.trim() !== '') return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return `${(parsed * 100).toFixed(1)}%`;
};

export const normalizeCurrency = (value, fallback = '$0') => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return `$${parsed.toLocaleString()}`;
};

export const emptyIntegrationPayload = () => ({
  googleAnalytics: {
    connected: false,
    propertyId: null,
    users30d: null,
    sessions30d: null,
    bounceRate: null,
    topPages: [],
    goalConversions: null,
    revenue30d: null,
    lastUpdated: null,
    error: null,
  },
  social: {
    connected: false,
    platforms: {},
    followers: null,
    engagementRate: null,
    impressions30d: null,
    topPosts: [],
    lastUpdated: null,
    error: null,
  },
  email: {
    connected: false,
    provider: null,
    subscribers: null,
    openRate: null,
    clickRate: null,
    campaigns: [],
    revenuePerCampaign: null,
    lastUpdated: null,
    error: null,
  },
  community: {
    connected: false,
    platform: null,
    members: null,
    activeToday: null,
    growth30d: null,
    topMembers: [],
    lastUpdated: null,
    error: null,
  },
  fetchedAt: null,
});

export default {
  normalizeNumber,
  normalizePercent,
  normalizeCurrency,
  emptyIntegrationPayload,
};
