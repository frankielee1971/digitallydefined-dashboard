// Integration configuration and feature flags
export const INTEGRATIONS = {
  googleAnalytics: {
    enabled: import.meta.env.VITE_GA_INTEGRATION_ENABLED === 'true',
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
    propertyId: import.meta.env.VITE_GA_PROPERTY_ID || '',
    oauthClientId: import.meta.env.VITE_GA_OAUTH_CLIENT_ID || '',
  },
  social: {
    enabled: import.meta.env.VITE_SOCIAL_INTEGRATION_ENABLED === 'true',
    platforms: {
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
    },
  },
  email: {
    enabled: import.meta.env.VITE_EMAIL_INTEGRATION_ENABLED === 'true',
    provider: import.meta.env.VITE_EMAIL_PROVIDER || 'brevo',
    brevo: {
      apiKey: import.meta.env.VITE_BREVO_API_KEY || '',
      listId: import.meta.env.VITE_BREVO_LIST_ID || '',
    },
    mailchimp: {
      apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY || '',
      listId: import.meta.env.VITE_MAILCHIMP_LIST_ID || '',
      serverPrefix: import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX || '',
    },
  },
  community: {
    enabled: import.meta.env.VITE_COMMUNITY_INTEGRATION_ENABLED === 'true',
    platform: import.meta.env.VITE_COMMUNITY_PLATFORM || 'facebook',
    facebookGroupId: import.meta.env.VITE_FACEBOOK_GROUP_ID || '',
    discord: {
      botToken: import.meta.env.VITE_DISCORD_BOT_TOKEN || '',
      guildId: import.meta.env.VITE_DISCORD_GUILD_ID || '',
    },
    mightyNetworks: {
      apiKey: import.meta.env.VITE_MIGHTY_NETWORKS_API_KEY || '',
      communityId: import.meta.env.VITE_MIGHTY_NETWORKS_COMMUNITY_ID || '',
    },
  },
  status: {
    googleAnalytics: 'disconnected',
    social: 'disconnected',
    email: 'disconnected',
    community: 'disconnected',
  },
};

export default INTEGRATIONS;
