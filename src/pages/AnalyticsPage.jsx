// src/pages/AnalyticsPage.jsx
// Live website analytics for the DigitallyDefined dashboard.
// Reads from the Supabase `analytics` Edge Function and briefs the
// AI Business Partner with real data.

import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw, TrendingUp, Users, MousePointerClick, Timer } from "lucide-react";
import { fetchAnalytics, getAnalyticsBrief, formatBriefAsContext } from "../lib/analytics";
import { brutalCard, brutalHeading, brutalButtonPrimary, theme } from "../theme";

const cardStyle = { ...brutalCard, backgroundColor: theme.colors.card, padding: "1rem" };

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div style={{ ...cardStyle, display: "grid", gap: "0.25rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: theme.colors.textMuted, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {Icon ? <Icon size={14} /> : null}
      {label}
    </div>
    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: theme.colors.text.primary }}>{value}</div>
    {sub ? <div style={{ fontSize: "0.75rem", color: theme.colors.textMuted }}>{sub}</div> : null}
  </div>
);

const Table = ({ columns, rows, empty = "No data yet." }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} style={{ textAlign: "left", borderBottom: "1px solid #111", padding: "0.4rem 0.5rem", fontWeight: 800 }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: "0.6rem 0.5rem", color: theme.colors.textMuted }}>
              {empty}
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "0.4rem 0.5rem" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const pct = (v) => `${((Number(v) || 0) * 100).toFixed(1)}%`;

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [partnerSummary, setPartnerSummary] = useState("");
  const [partnerLoading, setPartnerLoading] = useState(false);

  const load = useCallback(async (windowDays = days) => {
    setLoading(true);
    setError("");
    try {
      const [data, snapshot] = await Promise.all([
        fetchAnalytics("overview", windowDays),
        getAnalyticsBrief(windowDays),
      ]);
      setOverview(data);
      setBrief(snapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load(days);
  }, [days, load]);

  const runPartnerAnalysis = async () => {
    setPartnerLoading(true);
    setPartnerSummary("");
    try {
      const result = await fetchAnalytics("recommend", days);
      let analysis = result.analysis || "";
      try {
        const cleaned = analysis.replace(/^```(?:json)?\s*/gm, "").replace(/```\s*$/gm, "").trim();
        const parsed = JSON.parse(cleaned);
        analysis = [
          parsed.summary,
          parsed.opportunities?.length ? `\nOpportunities:\n${parsed.opportunities.map((o) => `- ${o.title} (${o.expected_impact} impact) — ${o.why}`).join("\n")}` : "",
          parsed.failing_funnels?.length ? `\nFailing funnels:\n${parsed.failing_funnels.map((f) => `- ${f.funnel}: ${f.symptom} → ${f.fix}`).join("\n")}` : "",
          parsed.next_actions?.length ? `\nNext actions:\n${parsed.next_actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}` : "",
        ].filter(Boolean).join("\n");
      } catch {
        // Keep raw text if the model returned non-JSON.
      }
      setPartnerSummary(analysis || "No analysis returned.");
    } catch (err) {
      setPartnerSummary(`Analysis failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setPartnerLoading(false);
    }
  };

  const traffic = overview?.traffic || {};
  const engagement = overview?.engagement || {};
  const leads = overview?.leads || {};
  const conversions = overview?.conversions || {};
  const quiz = overview?.funnels?.quiz || {};
  const assets = overview?.assets || [];
  const products = overview?.products || [];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <h2 style={{ ...brutalHeading, margin: 0, fontSize: "1.2rem" }}>Website Analytics</h2>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ border: "1px solid #111", padding: "0.4rem", background: theme.colors.card, fontFamily: theme.fonts.body }}
            aria-label="Analytics window"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button onClick={() => load(days)} style={{ ...brutalButtonPrimary, display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.7rem" }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ ...cardStyle, borderColor: theme.colors.danger, color: theme.colors.danger, fontSize: "0.85rem" }}>
          ⚠ {error}
        </div>
      )}

      {/* Traffic + engagement */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
        <StatCard icon={TrendingUp} label="Page Views" value={traffic.page_views ?? 0} sub={`${traffic.unique_sessions ?? 0} unique sessions`} />
        <StatCard icon={Users} label="Leads" value={leads.total ?? 0} sub={`Visitor→lead ${pct(conversions.visitor_to_lead_rate)}`} />
        <StatCard icon={MousePointerClick} label="CTA Clicks" value={conversions.cta_clicks ?? 0} sub={`${conversions.form_submits ?? 0} form submits`} />
        <StatCard icon={Timer} label="Avg Session" value={`${traffic.avg_session_seconds ?? 0}s`} sub={`Bounce ${pct(traffic.bounce_rate)}`} />
        <StatCard label="Scroll Depth" value={`${engagement.avg_scroll_depth_pct ?? 0}%`} sub={`Quiz completion ${pct(quiz.completion_rate)}`} />
      </div>

      {/* Top pages */}
      <div style={cardStyle}>
        <h3 style={{ ...brutalHeading, fontSize: "1rem", margin: "0 0 0.6rem" }}>Top Pages (Traffic)</h3>
        <Table
          columns={["Page", "Views"]}
          rows={(traffic.top_pages || []).map((p) => [p.page, p.views])}
          empty="No page views tracked yet."
        />
      </div>

      {/* Leads */}
      <div style={cardStyle}>
        <h3 style={{ ...brutalHeading, fontSize: "1rem", margin: "0 0 0.6rem" }}>Leads by Source Page</h3>
        <Table
          columns={["Source Page", "Leads"]}
          rows={(leads.top_sources || []).map((s) => [s.source_page, s.count])}
          empty="No leads captured yet."
        />
      </div>

      {/* Asset performance */}
      <div style={cardStyle}>
        <h3 style={{ ...brutalHeading, fontSize: "1rem", margin: "0 0 0.6rem" }}>Asset Performance</h3>
        <Table
          columns={["Asset", "Type", "Views", "Clicks", "Conversions"]}
          rows={assets.map((a) => [a.asset_name, a.asset_type, a.views, a.clicks, a.conversions])}
          empty="No asset activity yet."
        />
      </div>

      {/* Product interest */}
      <div style={cardStyle}>
        <h3 style={{ ...brutalHeading, fontSize: "1rem", margin: "0 0 0.6rem" }}>Product Interest</h3>
        <Table
          columns={["Product", "Interest", "Views"]}
          rows={products.map((p) => [p.product_name, p.interest_count, p.views])}
          empty="No product interest signals yet."
        />
      </div>

      {/* AI Business Partner briefing */}
      <div style={{ ...cardStyle, display: "grid", gap: "0.6rem" }}>
        <h3 style={{ ...brutalHeading, fontSize: "1rem", margin: 0 }}>AI Business Partner — Live Data Briefing</h3>
        <p style={{ margin: 0, fontSize: "0.8rem", color: theme.colors.textMuted }}>
          This snapshot is what the AI partner reads when you ask about growth, bottlenecks, or what to build next.
        </p>
        <pre style={{ margin: 0, fontSize: "0.75rem", whiteSpace: "pre-wrap", background: theme.colors.panel, border: "1px solid #111", padding: "0.7rem" }}>
{brief ? formatBriefAsContext(brief) : loading ? "Loading analytics…" : "No data available."}
        </pre>
        <button onClick={runPartnerAnalysis} disabled={partnerLoading} style={{ ...brutalButtonPrimary, justifySelf: "start", padding: "0.5rem 0.8rem" }}>
          {partnerLoading ? "Analyzing live data…" : "Analyze & Recommend Next Moves"}
        </button>
        {partnerSummary && (
          <pre style={{ margin: 0, fontSize: "0.8rem", whiteSpace: "pre-wrap", background: theme.colors.infoTint, border: "1px solid #111", padding: "0.7rem", fontFamily: theme.fonts.body }}>
{partnerSummary}
          </pre>
        )}
      </div>
    </div>
  );
}