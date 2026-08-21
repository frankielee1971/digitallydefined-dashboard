// Vercel Serverless Function: /api/hermes
// Handles dashboard sync, assistant reasoning, and integration intelligence.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const action = body?.action || body?.message || '';
  const API_KEY = process.env.VITE_DASHBOARD_API_KEY || '';
  const EDGE_URL = 'https://dijjlppdljpcgyoakdnq.supabase.co/functions/v1/hermes';

  // Local integration status endpoint
  if (action === 'integrations.sync' || action === 'integrations.list') {
    const integrations = {
      googleAnalytics: {
        connected: Boolean(process.env.VITE_GA_MEASUREMENT_ID && process.env.VITE_GA_PROPERTY_ID),
        propertyId: process.env.VITE_GA_PROPERTY_ID || null,
        lastUpdated: new Date().toISOString(),
      },
      social: {
        connected: Boolean(
          process.env.VITE_FACEBOOK_PAGE_ID ||
          process.env.VITE_INSTAGRAM_BUSINESS_ID ||
          process.env.VITE_YOUTUBE_CHANNEL_ID ||
          process.env.VITE_TWITTER_BEARER_TOKEN ||
          process.env.VITE_LINKEDIN_ORG_ID
        ),
        lastUpdated: new Date().toISOString(),
      },
      email: {
        connected: Boolean(process.env.VITE_BREVO_API_KEY || process.env.VITE_MAILCHIMP_API_KEY),
        provider: process.env.VITE_EMAIL_PROVIDER || 'brevo',
        lastUpdated: new Date().toISOString(),
      },
      community: {
        connected: Boolean(
          process.env.VITE_FACEBOOK_GROUP_ID ||
          process.env.VITE_DISCORD_BOT_TOKEN ||
          process.env.VITE_MIGHTY_NETWORKS_API_KEY
        ),
        platform: process.env.VITE_COMMUNITY_PLATFORM || 'facebook',
        lastUpdated: new Date().toISOString(),
      },
    };

    return res.status(200).json({ success: true, integrations });
  }

  // Assistant endpoint with integration-aware reasoning
  if (action === 'assistant' || body?.snapshot) {
    const snapshot = body?.snapshot || {};
    const message = (body?.message || '').toLowerCase();
    const integrations = snapshot?.integrations || {};
    const stats = snapshot?.stats || {};
    const data = snapshot?.data || {};

    // Build context-aware reply from integration data
    const reply = buildIntegrationAwareReply({
      message,
      integrations,
      stats,
      data,
    });

    return res.status(200).json({ success: true, reply });
  }

  // Dashboard sync endpoint
  if (action === 'dashboard') {
    try {
      const response = await fetch(EDGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({ error: 'Invalid response from backend' }));
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Dashboard sync failed', message: error.message });
    }
  }

  // Automation list endpoint
  if (action === 'automation.list') {
    try {
      const response = await fetch(EDGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({ error: 'Invalid response from backend' }));
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Automation list failed', message: error.message });
    }
  }

  // Default: forward to Supabase Edge Function
  try {
    const response = await fetch(EDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({ error: 'Invalid response from backend' }));
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Request failed', message: error.message });
  }
}

function buildIntegrationAwareReply({ message, integrations, stats, data }) {
  const parts = [];
  const ga = integrations?.googleAnalytics || {};
  const social = integrations?.social || {};
  const email = integrations?.email || {};
  const community = integrations?.community || {};

  // Base status
  parts.push(`Last sync: ${stats?.lastSync || 'No sync yet'}.`);
  parts.push(`Revenue: ${stats?.revenue || '$0'} | Leads: ${stats?.leads || 0} | Conversion: ${stats?.conversionRate || '0%'} | Asset value: ${stats?.assetValue || 'N/A'}.`);

  // Integration insights
  if (ga.connected && ga.users30d != null) {
    parts.push(`Google Analytics: ${ga.users30d.toLocaleString()} users and ${ga.sessions30d != null ? ga.sessions30d.toLocaleString() : 'N/A'} sessions in the last 30 days.`);
    if (ga.bounceRate != null) {
      parts.push(`Bounce rate is ${(ga.bounceRate * 100).toFixed(1)}%. ${ga.bounceRate > 0.6 ? 'Consider improving landing page relevance and load speed.' : 'Good engagement.'}`);
    }
    if (ga.goalConversions != null) {
      parts.push(`${ga.goalConversions} goal conversions recorded.`);
    }
    if (ga.revenue30d != null) {
      parts.push(`GA revenue signal: $${Number(ga.revenue30d).toLocaleString()} in the last 30 days.`);
    }
  } else {
    parts.push('Google Analytics is not connected. Connect it to unlock traffic-based scaling recommendations.');
  }

  if (social.connected) {
    parts.push(`Social: ${social.followers != null ? social.followers.toLocaleString() + ' followers' : 'followers tracked'} with ${social.engagementRate != null ? (social.engagementRate * 100).toFixed(1) + '% engagement' : 'engagement tracked'}.`);
    if (social.impressions30d != null) {
      parts.push(`${social.impressions30d.toLocaleString()} impressions in the last 30 days.`);
    }
    if (social.topPosts?.length) {
      parts.push(`Top social content: ${social.topPosts.map(p => p.title || p.platform).slice(0, 2).join(', ')}.`);
    }
  } else {
    parts.push('Social pages are not connected. Connect them to track reach and top-performing content.');
  }

  if (email.connected) {
    parts.push(`Email: ${email.subscribers != null ? email.subscribers.toLocaleString() + ' subscribers' : 'subscriber count tracked'}, ${email.openRate != null ? (email.openRate * 100).toFixed(1) + '% open rate' : 'open rate tracked'}, ${email.clickRate != null ? (email.clickRate * 100).toFixed(1) + '% click rate' : 'click rate tracked'}.`);
    if (email.revenuePerCampaign != null) {
      parts.push(`Revenue per campaign: $${Number(email.revenuePerCampaign).toLocaleString()}.`);
    }
    if (email.campaigns?.length) {
      parts.push(`Active campaigns: ${email.campaigns.map(c => c.name).slice(0, 2).join(', ')}.`);
    }
  } else {
    parts.push('Email is not connected. Connect Brevo or Mailchimp to read list health and campaign ROI.');
  }

  if (community.connected) {
    parts.push(`Community: ${community.members != null ? community.members.toLocaleString() + ' members' : 'member count tracked'}, ${community.activeToday != null ? community.activeToday + ' active today' : 'activity tracked'}, ${community.growth30d != null ? (community.growth30d * 100).toFixed(1) + '% growth over 30 days' : 'growth tracked'}.`);
  } else {
    parts.push('Community is not connected. Connect it to track member growth and engagement.');
  }

  // Alerts and reputation signals
  const alerts = data?.alerts || [];
  if (alerts.length) {
    parts.push(`Alerts: ${alerts.slice(0, 2).map(a => `${a.type || 'info'} from ${a.source || 'System'}: ${a.message}`).join(' ')}`);
  }

  const negativeReviews = (data?.reviews || []).filter((review) =>
    String(review.sentiment || review.rating || '').toLowerCase().includes('negative')
  );
  if (negativeReviews.length) {
    parts.push(`${negativeReviews.length} negative review(s) need a public reply.`);
  }

  // Scaling recommendations
  parts.push(buildScalingRecommendations({ message, integrations, stats, data }));

  // Next action
  const nextAction = data?.aiBrief?.nextActions?.[0] || pickNextAction(integrations, stats, data);
  parts.push(`Best next move: ${nextAction}`);

  parts.push('Add your OpenRouter key in Settings when you want me to answer follow-up questions with full AI reasoning.');

  return parts.join('\n\n');
}

function buildScalingRecommendations({ message, integrations, stats, data }) {
  const recommendations = [];
  const ga = integrations?.googleAnalytics || {};
  const social = integrations?.social || {};
  const email = integrations?.email || {};
  const community = integrations?.community || {};

  // Traffic scaling
  if (ga.connected && ga.users30d != null) {
    if (ga.bounceRate != null && ga.bounceRate > 0.6) {
      recommendations.push('Traffic is high but bouncing. Improve landing page clarity and CTA placement to convert more visitors.');
    }
    if (ga.goalConversions != null && ga.goalConversions < 50) {
      recommendations.push('Goal conversions are low. Add one focused lead magnet and test a simpler checkout flow.');
    }
    if (ga.revenue30d != null && Number(ga.revenue30d) > 5000) {
      recommendations.push('Revenue signal is strong. Consider increasing ad spend on your top-converting traffic source.');
    }
  } else if (!ga.connected) {
    recommendations.push('Connect Google Analytics to unlock traffic-based scaling recommendations.');
  }

  // Social scaling
  if (social.connected) {
    if (social.engagementRate != null && social.engagementRate < 0.02) {
      recommendations.push('Social engagement is low. Test shorter hooks, clearer CTAs, and more frequent community-focused posts.');
    }
    if (social.impressions30d != null && social.impressions30d > 20000) {
      recommendations.push('Strong impressions. Use retargeting to bring warm social visitors back to a high-converting offer.');
    }
  } else if (!social.connected) {
    recommendations.push('Connect your social pages to see top content and double down on what already works.');
  }

  // Email scaling
  if (email.connected) {
    if (email.openRate != null && email.openRate < 0.2) {
      recommendations.push('Open rates are below benchmark. Test new subject lines and sender names to improve deliverability.');
    }
    if (email.clickRate != null && email.clickRate < 0.08) {
      recommendations.push('Click rates are low. Tighten email copy and make the primary CTA more prominent.');
    }
    if (email.revenuePerCampaign != null && Number(email.revenuePerCampaign) > 1000) {
      recommendations.push('Email revenue per campaign is healthy. Increase send frequency for your top-performing sequence.');
    }
  } else if (!email.connected) {
    recommendations.push('Connect Brevo or Mailchimp to track list growth, revenue per campaign, and churn risk.');
  }

  // Community scaling
  if (community.connected) {
    if (community.growth30d != null && community.growth30d < 0.05) {
      recommendations.push('Community growth is slow. Launch a referral incentive or a 7-day challenge to reactivate members.');
    }
    if (community.activeToday != null && community.activeToday < 50) {
      recommendations.push('Daily active members are low. Post a daily prompt, member spotlight, or quick win to increase engagement.');
    }
  } else if (!community.connected) {
    recommendations.push('Connect your community to see growth trends and activation opportunities.');
  }

  if (!recommendations.length) {
    return 'Review the latest stats, then pick one growth or retention action to push today.';
  }

  return `Scaling plan: ${recommendations[0]}${recommendations.length > 1 ? ` Also: ${recommendations[1]}` : ''}`;
}

function pickNextAction(integrations, stats, data) {
  const negativeReviews = (data?.reviews || []).filter((review) =>
    String(review.sentiment || review.rating || '').toLowerCase().includes('negative')
  );

  if (negativeReviews.length) {
    return 'Start with the reviews that need a public reply.';
  }

  const ga = integrations?.googleAnalytics || {};
  if (!ga.connected) {
    return 'Connect Google Analytics first so I can see where traffic and conversions are coming from.';
  }

  const email = integrations?.email || {};
  if (!email.connected) {
    return 'Connect your email provider so I can track list growth and campaign revenue.';
  }

  const social = integrations?.social || {};
  if (!social.connected) {
    return 'Connect your social pages so I can identify top-performing content and reach.';
  }

  const community = integrations?.community || {};
  if (!community.connected) {
    return 'Connect your community so I can track member growth and engagement signals.';
  }

  return 'Review the latest stats, then pick one growth or retention action to push today.';
}
