// src/lib/analytics.js
// Dashboard client for the DigitallyDefined analytics pipeline.
// Reads aggregated website data from the Supabase `analytics` Edge Function.

import { getSupabaseEdgeUrl, getSupabaseEdgeHeaders } from './supabase-edge';

const ANALYTICS_URL = getSupabaseEdgeUrl('analytics');

/**
 * Fetch analytics from the edge function.
 * @param {string} action  overview|traffic|funnels|assets|products|recommend
 * @param {number} days    lookback window
 */
export async function fetchAnalytics(action = 'overview', days = 30) {
  const res = await fetch(ANALYTICS_URL, {
    method: 'POST',
    headers: getSupabaseEdgeHeaders(),
    body: JSON.stringify({ action, days }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Analytics request failed: ${res.status}`);
  }
  return res.json();
}

/** Compact snapshot used to brief the AI Business Partner. */
export async function getAnalyticsBrief(days = 30) {
  const data = await fetchAnalytics('overview', days);
  return {
    period_days: data.period_days,
    page_views: data.traffic?.page_views ?? 0,
    unique_sessions: data.traffic?.unique_sessions ?? 0,
    avg_session_seconds: data.traffic?.avg_session_seconds ?? 0,
    bounce_rate: data.traffic?.bounce_rate ?? 0,
    top_pages: data.traffic?.top_pages ?? [],
    avg_scroll_depth_pct: data.engagement?.avg_scroll_depth_pct ?? 0,
    leads_total: data.leads?.total ?? 0,
    lead_sources: data.leads?.top_sources ?? [],
    conversions: data.conversions ?? {},
    quiz_funnel: data.funnels?.quiz ?? {},
    top_assets: (data.assets ?? []).slice(0, 5),
    top_products: data.products ?? [],
  };
}

export function formatBriefAsContext(brief) {
  if (!brief) return '';
  return [
    `Website analytics snapshot (last ${brief.period_days} days):`,
    `- Page views: ${brief.page_views} across ${brief.unique_sessions} sessions`,
    `- Avg session: ${brief.avg_session_seconds}s | Bounce rate: ${(brief.bounce_rate * 100).toFixed(1)}%`,
    `- Avg scroll depth: ${brief.avg_scroll_depth_pct}%`,
    `- Leads captured: ${brief.leads_total}`,
    `- Visitor→lead rate: ${((brief.conversions.visitor_to_lead_rate || 0) * 100).toFixed(2)}%`,
    `- CTA clicks: ${brief.conversions.cta_clicks || 0}`,
    `- Quiz completion rate: ${((brief.quiz_funnel.completion_rate || 0) * 100).toFixed(1)}% (${brief.quiz_funnel.completed}/${brief.quiz_funnel.started})`,
    `- Top pages: ${brief.top_pages.slice(0, 5).map((p) => `${p.page} (${p.views})`).join(', ') || 'n/a'}`,
    `- Lead sources: ${brief.lead_sources.map((s) => `${s.source_page} (${s.count})`).join(', ') || 'n/a'}`,
    `- Top products by interest: ${brief.top_products.slice(0, 3).map((p) => `${p.product_name} (${p.interest_count})`).join(', ') || 'n/a'}`,
  ].join('\n');
}

export default { fetchAnalytics, getAnalyticsBrief, formatBriefAsContext };