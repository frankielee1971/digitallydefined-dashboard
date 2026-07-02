import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  FileText,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  DollarSign,
  FolderHeart,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Workflow,
  X,
} from "lucide-react";
import CONFIG from "../config";
import Logo from "../components/Logo";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalCard,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";

const dashboardConfig = CONFIG.dashboard;

const dashboardLabels = {
  syncButton: dashboardConfig.syncButtonLabel || "Sync Vault",
  settings:
    dashboardConfig.settingsLabel ||
    dashboardConfig.systemKeysLabel ||
    "Settings",
  navigation: dashboardConfig.navigationTitle || "Navigation",
  noSync: dashboardConfig.noSyncLabel || "No sync yet",
  saveSettings:
    dashboardConfig.saveSettingsLabel ||
    dashboardConfig.saveKeysLabel ||
    "Save Settings",
  metrics: {
    revenue: dashboardConfig.metrics?.revenue || "Revenue",
    leads: dashboardConfig.metrics?.leads || "Leads",
    conversion: dashboardConfig.metrics?.conversion || "Conversion",
    assetValue:
      dashboardConfig.metrics?.assetValue ||
      dashboardConfig.stats?.assetValue ||
      "Asset Value",
  },
};

const API_URL = import.meta.env.VITE_HERMES_GATEWAY_URL || "";

const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";
const API_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

const ASSISTANT_MODEL =
  import.meta.env.VITE_DASHBOARD_ASSISTANT_MODEL ||
  dashboardConfig.assistantModel ||
  "openai/gpt-4o-mini";

const assistantWelcome = {
  role: "assistant",
  content:
    "I am ready. Sync the Vault, then ask me what needs attention, what automations look stuck, or what move should come next.",
};

const tabIcons = {
  dashboard: LayoutDashboard,
  reputation: ShieldCheck,
  intel: BarChart3,
  brain: BrainCircuit,
  automations: Workflow,
  notion: Bot,
};

const formatConversion = (value) => {
  if (typeof value === "string" && value.trim() !== "") return value;
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
};

const formatAssetValue = (value) => {
  if (typeof value === "number") return `$${value.toLocaleString()}`;
  if (typeof value === "string" && value.trim() !== "") return value;
  return CONFIG.metrics.assetValue;
};

const cardStyle = {
  ...brutalCard,
  backgroundColor: theme.colors.card,
};

const compactGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "0.75rem",
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const summarizeList = (items, mapper, limit = 5) =>
  normalizeArray(items)
    .slice(0, limit)
    .map(mapper)
    .filter(Boolean);

const normalizeData = (payload = {}) => ({
  reviews: normalizeArray(payload.reviews).map((review) => ({
    ...review,
    name: review.name || review.reviewerName || "Anonymous",
    reviewText: review.reviewText || review.text || "",
    aiDraftedResponse:
      review.aiDraftedResponse ||
      review.aIDraftedResponse ||
      review.aiResponse ||
      "",
  })),
  competitors: normalizeArray(payload.competitors),
  community: normalizeArray(payload.community),
  campaigns: normalizeArray(payload.campaigns),
  email: Array.isArray(payload.email) ? payload.email[0] || {} : payload.email || {},
  alerts: normalizeArray(payload.alerts),
  sourceHealth: payload.sourceHealth || null,
  aiBrief: payload.aiBrief || null,
  automations: normalizeArray(payload.automations),
  notion: payload.notion || null,
});

const emptyData = normalizeData();

const buildAssistantSnapshot = ({ stats, data, lastSync }) => ({
  lastSync: lastSync || "No sync yet",
  stats,
  sourceHealth: data.sourceHealth || {},
  alerts: summarizeList(
    data.alerts,
    (alert) => `${alert.type || "info"} from ${alert.source || "System"}: ${alert.message}`,
  ),
  reviews: summarizeList(
    data.reviews,
    (review) =>
      `${review.name}: ${review.reviewText || "No review text"}${
        review.aiDraftedResponse ? ` | AI reply: ${review.aiDraftedResponse}` : ""
      }`,
  ),
  campaigns: summarizeList(
    data.campaigns,
    (campaign) =>
      `${campaign.name || "Campaign"}: open ${campaign.openRate ?? "N/A"}, click ${
        campaign.clickRate ?? "N/A"
      }`,
  ),
  competitors: summarizeList(
    data.competitors,
    (competitor) =>
      `${competitor.name || competitor.competitor || "Competitor"}: ${
        competitor.notes || "No notes"
      }`,
  ),
  aiBrief: data.aiBrief || {},
  automations: summarizeList(
    data.automations,
    (automation) =>
      `${automation.name || "Automation"}: ${automation.status || "unknown"}${
        automation.lastRun ? ` | last run: ${automation.lastRun}` : ""
      }`,
  ),
});

const createLocalAssistantReply = ({ stats, data, lastSync }) => {
  const alerts = data.alerts.length
    ? data.alerts.slice(0, 2).map((alert) => alert.message).join(" ")
    : "No active alerts are showing.";
  const negativeReviews = data.reviews.filter((review) =>
    String(review.sentiment || review.rating || "").toLowerCase().includes("negative"),
  );
  const nextAction =
    data.aiBrief?.nextActions?.[0] ||
    (negativeReviews.length
      ? "Start with the reviews that need a public reply."
      : "Review the latest stats, then pick one growth or retention action to push today.");

  const automationSummary = data.automations.length
    ? data.automations
        .slice(0, 3)
        .map((a) => `${a.name || "Automation"}: ${a.status || "unknown"}`)
        .join(", ")
    : "No automations running.";

  return [
    `Last sync: ${lastSync || "No sync yet"}.`,
    `Revenue is ${stats.revenue}, leads are ${stats.leads}, conversion is ${stats.conversionRate}, and asset value is ${stats.assetValue}.`,
    alerts,
    `Automations: ${automationSummary}`,
    `Best next move: ${nextAction}`,
    "Add your OpenRouter key in Settings when you want me to answer follow-up questions with full AI reasoning.",
  ].join("\n\n");
};

const MetricCard = ({ icon: Icon, label, value }) => (
  <div style={{ ...cardStyle, padding: "0.9rem" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "0.75rem",
        marginBottom: "0.45rem",
      }}
    >
      <span style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>
        {label}
      </span>
      <Icon size={17} color={theme.colors.aquaBlue} />
    </div>
    <strong style={{ fontSize: "1.08rem" }}>{value}</strong>
  </div>
);

const InfoBlock = ({ label, value }) => (
  <div style={{ ...cardStyle, padding: "0.75rem" }}>
    <div style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>
      {label}
    </div>
    <div style={{ marginTop: "0.25rem", fontWeight: 800 }}>{value}</div>
  </div>
);

const EmptyState = ({ children }) => (
  <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.9rem" }}>
    {children}
  </p>
);

function NotionTab({ notion }) {
  if (!notion) {
    return (
      <EmptyState>
        Notion data will appear here after the next Sync Vault.
      </EmptyState>
    );
  }

  const ideas = Array.isArray(notion.ideas) ? notion.ideas : [];
  const content = Array.isArray(notion.content) ? notion.content : [];
  const automations = Array.isArray(notion.automations) ? notion.automations : [];
  const intake = Array.isArray(notion.intake) ? notion.intake : [];
  const publishingQueue = Array.isArray(notion.publishingQueue) ? notion.publishingQueue : [];
  const approvals = Array.isArray(notion.approvals) ? notion.approvals : [];
  const buyerSignals = Array.isArray(notion.buyerSignals) ? notion.buyerSignals : [];
  const aiDrafts = Array.isArray(notion.aiDrafts) ? notion.aiDrafts : [];

  const statusColor = (rawStatus) => {
    const value = String(rawStatus || '').toLowerCase();
    if (value.includes('build now') || value.includes('ready') || value.includes('published')) return theme.colors.success;
    if (value.includes('pending') || value.includes('review') || value.includes('draft')) return theme.colors.warning;
    if (value.includes('slipping') || value.includes('stuck')) return theme.colors.darkRed;
    return theme.colors.muted;
  };

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {intake.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Intake Queue
          </h3>
          {intake.slice(0, 20).map((idea, index) => (
            <div
              key={idea.id || index}
              style={{ ...cardStyle, padding: "0.75rem", display: "grid", gap: "0.25rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                <strong>{idea.title || "Untitled idea"}</strong>
                <span
                  style={{
                    color: statusColor(idea.score),
                    fontSize: "0.72rem",
                    fontWeight: 800,
                  }}
                >
                  {idea.score || "unscored"} · {idea.route || "no route"}
                </span>
              </div>
              {idea.status && (
                <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
                  Status: {idea.status}
                </span>
              )}
            </div>
          ))}
        </section>
      )}

      {ideas.length > 0 && !intake.length && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Ideas DB ({ideas.length})
          </h3>
          {ideas.slice(0, 10).map((item, index) => (
            <div key={item.id || index} style={{ ...cardStyle, padding: "0.75rem" }}>
              <strong>{item.title || "Untitled"}</strong>
              <span style={{ color: theme.colors.muted, fontSize: "0.78rem", marginLeft: "0.5rem" }}>
                {item.status || "New"}
              </span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.colors.aquaBlue, fontSize: "0.78rem", textDecoration: "none", marginTop: "0.25rem", display: "inline-block" }}
                >
                  Open in Notion ↗
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {content.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Content Blocks ({content.length})
          </h3>
          {content.slice(0, 8).map((item, index) => (
            <div key={item.id || index} style={{ ...cardStyle, padding: "0.75rem" }}>
              <strong>{item.title || "Untitled"}</strong>
              <span style={{ color: theme.colors.muted, fontSize: "0.78rem", marginLeft: "0.5rem" }}>
                {item.status || ""}
              </span>
            </div>
          ))}
        </section>
      )}

      {automations.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Automations ({automations.length})
          </h3>
          {automations.slice(0, 8).map((item, index) => (
            <div key={item.id || index} style={{ ...cardStyle, padding: "0.75rem" }}>
              <strong>{item.title || "Untitled"}</strong>
              <span style={{ color: theme.colors.muted, fontSize: "0.78rem", marginLeft: "0.5rem" }}>
                {item.status || "New"}
              </span>
            </div>
          ))}
        </section>
      )}

      {publishingQueue.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Publishing Queue ({publishingQueue.length})
          </h3>
          {publishingQueue.slice(0, 20).map((item, index) => (
            <div key={item.id || index} style={{ ...cardStyle, padding: "0.75rem", display: "grid", gap: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                <strong>{item.title || "Untitled"}</strong>
                <span style={{ color: statusColor(item.status), fontSize: "0.72rem", fontWeight: 800 }}>
                  {item.contentType || ""} {item.status ? `· ${item.status}` : ""}
                </span>
              </div>
              {(item.source || item.due) && (
                <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
                  {item.source ? `Source: ${item.source}` : ""}
                  {item.source && item.due ? " | " : ""}
                  {item.due ? `Due: ${item.due}` : ""}
                </span>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.colors.aquaBlue, fontSize: "0.78rem", textDecoration: "none", marginTop: "0.25rem", display: "inline-block" }}
                >
                  Open in Notion ↗
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {approvals.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Content Approvals ({approvals.length})
          </h3>
          {approvals.slice(0, 20).map((item, index) => (
            <div key={item.id || index} style={{ ...cardStyle, padding: "0.75rem", display: "grid", gap: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                <strong>{item.title || "Untitled"}</strong>
                <span style={{ color: statusColor(item.status), fontSize: "0.72rem", fontWeight: 800 }}>
                  {item.contentType || ""} {item.status ? `· ${item.status}` : ""}
                </span>
              </div>
              {(item.requestedAt || item.approvedAt || item.notes) && (
                <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
                  {item.requestedAt ? `Requested: ${item.requestedAt}` : ""}
                  {item.requestedAt && item.approvedAt ? " | " : ""}
                  {item.approvedAt ? `Approved: ${item.approvedAt}` : ""}
                  {(item.requestedAt || item.approvedAt) && item.notes ? " | " : ""}
                  {item.notes || ""}
                </span>
              )}
            </div>
          ))}
        </section>
      )}

      {buyerSignals.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Buyer Signals ({buyerSignals.length})
          </h3>
          {buyerSignals.slice(0, 20).map((item, index) => (
            <div key={item.id || index} style={{ ...cardStyle, padding: "0.75rem", display: "grid", gap: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                <strong>{item.title || "Untitled"}</strong>
                <span style={{ color: theme.colors.muted, fontSize: "0.72rem", fontWeight: 800 }}>
                  {item.product || ""} {item.purchaseValue ? `· ${item.purchaseValue}` : ""}
                </span>
              </div>
              {(item.source || item.quizResult || item.customerEmail) && (
                <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
                  {[item.source, item.quizResult, item.customerEmail].filter(Boolean).join(" | ")}
                </span>
              )}
            </div>
          ))}
        </section>
      )}

      {aiDrafts.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            AI Content Drafts ({aiDrafts.length})
          </h3>
          {aiDrafts.slice(0, 20).map((item, index) => (
            <div key={item.id || index} style={{ ...cardStyle, padding: "0.75rem", display: "grid", gap: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                <strong>{item.title || "Untitled"}</strong>
                <span style={{ color: statusColor(item.status), fontSize: "0.72rem", fontWeight: 800 }}>
                  {item.status || "New"}
                </span>
              </div>
              {(item.agent || item.model || item.timestamp) && (
                <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
                  {[item.agent, item.model, item.timestamp].filter(Boolean).join(" | ")}
                </span>
              )}
            </div>
          ))}
        </section>
      )}

      {!intake.length && !ideas.length && !content.length && !automations.length && !publishingQueue.length && !approvals.length && !buyerSignals.length && !aiDrafts.length && (
        <EmptyState>
          No Notion database data available.
        </EmptyState>
      )}
    </div>
  );
}

function CommandTab({ data, stats }) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={compactGrid}>
        <InfoBlock label="Top Asset" value={stats.topAsset} />
        <InfoBlock label="Community Growth" value={stats.communityGrowth} />
        <InfoBlock label="Email Growth" value={stats.emailGrowth} />
        <InfoBlock label="Churn Risk" value={stats.churnRisk} />
      </div>

      {data.alerts.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            System Alerts
          </h3>
          {data.alerts.map((alert, index) => (
            <div
              key={`${alert.source || "alert"}-${index}`}
              style={{
                ...cardStyle,
                padding: "0.75rem",
                display: "flex",
                gap: "0.6rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  ...brutalEyebrow,
                  color:
                    alert.type === "critical"
                      ? theme.colors.darkRed
                      : alert.type === "warning"
                        ? theme.colors.orange
                        : theme.colors.aquaBlue,
                  fontSize: "0.62rem",
                }}
              >
                {alert.type || "info"}
              </span>
              <span style={{ fontSize: "0.88rem" }}>
                <strong>{alert.source || "System"}:</strong> {alert.message}
              </span>
            </div>
          ))}
        </section>
      )}

      {data.sourceHealth && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Source Health
          </h3>
          <div style={compactGrid}>
            {Object.entries(data.sourceHealth).map(([key, status]) => (
              <InfoBlock key={key} label={key} value={status} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReputationTab({ reviews }) {
  if (!reviews.length) {
    return <EmptyState>{dashboardConfig.reputationEmpty}</EmptyState>;
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {reviews.map((review, index) => (
        <article key={`${review.name}-${index}`} style={{ ...cardStyle, padding: "0.9rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "0.45rem",
            }}
          >
            <strong>{review.name}</strong>
            <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
              {review.date || ""}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>{review.reviewText}</p>
          {review.aiDraftedResponse && (
            <div
              style={{
                borderTop: brutalBorder,
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
              }}
            >
              <span style={{ ...brutalEyebrow, color: theme.colors.aquaBlue }}>
                {dashboardConfig.aiReplyLabel}
              </span>
              <p style={{ margin: "0.35rem 0 0", color: theme.colors.muted }}>
                {review.aiDraftedResponse}
              </p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function IntelTab({ data }) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={compactGrid}>
        <InfoBlock label="Email Subscribers" value={data.email?.subscribers ?? "N/A"} />
        <InfoBlock label="Open Rate" value={data.email?.openRate ?? "N/A"} />
        <InfoBlock label="Click Rate" value={data.email?.clickRate ?? "N/A"} />
        <InfoBlock label="Revenue / Campaign" value={data.email?.revenuePerCampaign ?? "N/A"} />
      </div>

      {data.campaigns.length > 0 ? (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Campaigns
          </h3>
          {data.campaigns.map((campaign, index) => (
            <div
              key={`${campaign.name}-${index}`}
              style={{
                ...cardStyle,
                padding: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <strong>{campaign.name}</strong>
              <span style={{ color: theme.colors.muted }}>
                Open: {campaign.openRate ?? "N/A"} | Click: {campaign.clickRate ?? "N/A"}
              </span>
            </div>
          ))}
        </section>
      ) : (
        <EmptyState>{dashboardConfig.intelEmpty}</EmptyState>
      )}

      {data.competitors.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            {dashboardConfig.marketIntelTitle}
          </h3>
          {data.competitors.map((competitor, index) => (
            <article
              key={`${competitor.name || competitor.competitor}-${index}`}
              style={{ ...cardStyle, padding: "0.75rem" }}
            >
              <strong>{competitor.name || competitor.competitor}</strong>
              {competitor.notes && (
                <p style={{ margin: "0.3rem 0 0", color: theme.colors.muted }}>
                  {competitor.notes}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function BrainTab({ aiBrief, notion }) {
  if (!aiBrief) {
    return <EmptyState>No AI brief available. Click Sync Vault to generate one.</EmptyState>;
  }

  const sections = [
    ["What's Working", aiBrief.working, CONFIG.colors.success],
    ["What's Slipping", aiBrief.slipping, theme.colors.darkRed],
    ["Next Actions", aiBrief.nextActions, theme.colors.orange],
  ];

  const intake = Array.isArray(notion?.intake) ? notion.intake : [];
  const buildNow = intake.filter((idea) => String(idea.route || '').toLowerCase().includes('build now'));
  const validate = intake.filter((idea) => String(idea.route || '').toLowerCase().includes('validate first'));

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {sections.map(([title, items, color]) =>
        items?.length ? (
          <section key={title} style={{ ...cardStyle, padding: "0.9rem" }}>
            <h3 style={{ ...brutalHeading, margin: "0 0 0.5rem", color, fontSize: "0.95rem" }}>
              {title}
            </h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
              {items.map((item, index) => (
                <li key={`${title}-${index}`} style={{ marginBottom: "0.35rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}

      {buildNow.length > 0 && (
        <section style={{ ...cardStyle, padding: "0.9rem", borderColor: theme.colors.success }}>
          <h3 style={{ ...brutalHeading, margin: "0 0 0.5rem", color: theme.colors.success, fontSize: "0.95rem" }}>
            Build Now Priority
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {buildNow.slice(0, 4).map((idea, index) => (
              <li key={idea.id || `build-${index}`} style={{ marginBottom: "0.25rem" }}>
                <strong>{idea.title || "Untitled"}</strong>
                <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
                  {" "}— {idea.score || "High"} {idea.products?.length ? `· ${idea.products[0]}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {validate.length > 0 && (
        <section style={{ ...cardStyle, padding: "0.9rem", borderColor: theme.colors.warning }}>
          <h3 style={{ ...brutalHeading, margin: "0 0 0.5rem", color: theme.colors.warning, fontSize: "0.95rem" }}>
            Validate First
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {validate.slice(0, 4).map((idea, index) => (
              <li key={idea.id || `validate-${index}`} style={{ marginBottom: "0.25rem" }}>
                <strong>{idea.title || "Untitled"}</strong>
                <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
                  {" "}— {idea.score || "Medium"} {idea.products?.length ? `· ${idea.products[0]}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function AutomationsTab({ automations }) {
  if (!automations.length) {
    return <EmptyState>{dashboardConfig.automationsEmpty || "No automations configured yet. Set up workflows in your backend to automate reviews, campaigns, and community tasks."}</EmptyState>;
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {automations.map((automation, index) => (
        <div
          key={`${automation.id || automation.name || index}`}
          style={{ ...cardStyle, padding: "0.9rem" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <strong>{automation.name || "Automation"}</strong>
            <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
              {automation.status || "unknown"}
            </span>
          </div>
          {automation.lastRun && (
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: theme.colors.muted }}>
              Last run: {automation.lastRun}
            </p>
          )}
          {automation.details && (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>{automation.details}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function DashboardAssistant({
  messages,
  input,
  isThinking,
  assistantError,
  onInputChange,
  onSubmit,
  onQuickPrompt,
}) {
  const quickPrompts = [
    "What needs my attention today?",
    "Summarize my automations.",
    "What is the next best move?",
  ];

  return (
    <section
      style={{
        ...cardStyle,
        padding: "1rem",
        backgroundColor: theme.colors.panel,
        display: "grid",
        gap: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <Bot size={19} color={theme.colors.aquaBlue} />
          <h2 style={{ ...brutalHeading, fontSize: "1rem", margin: 0 }}>
            Dashboard AI Assistant
          </h2>
        </div>
        <span style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.58rem" }}>
          {ASSISTANT_MODEL}
        </span>
      </div>

      <div
        style={{
          border: brutalBorder,
          backgroundColor: theme.colors.card,
          minHeight: 180,
          maxHeight: 280,
          overflowY: "auto",
          padding: "0.75rem",
          display: "grid",
          gap: "0.65rem",
          alignContent: "start",
        }}
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`${message.role}-${index}`}
              style={{
                justifySelf: isUser ? "end" : "start",
                maxWidth: "min(92%, 720px)",
                border: brutalBorder,
                backgroundColor: isUser ? theme.colors.aquaBlue : theme.colors.background,
                padding: "0.65rem 0.7rem",
                fontSize: "0.86rem",
                lineHeight: 1.45,
                whiteSpace: "pre-wrap",
              }}
            >
              {message.content}
            </div>
          );
        })}
        {isThinking && (
          <div
            style={{
              justifySelf: "start",
              border: brutalBorder,
              backgroundColor: theme.colors.background,
              padding: "0.65rem 0.7rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.86rem",
            }}
          >
            <Loader2 size={15} style={{ animation: "dd-spin 0.8s linear infinite" }} />
            Thinking through the dashboard...
          </div>
        )}
      </div>

      {assistantError && (
        <p style={{ margin: 0, color: theme.colors.darkRed, fontSize: "0.82rem" }}>
          {assistantError}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onQuickPrompt(prompt)}
            style={{
              border: brutalBorder,
              backgroundColor: theme.colors.card,
              color: theme.colors.textPrimary,
              padding: "0.42rem 0.55rem",
              fontSize: "0.75rem",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: theme.fonts.body,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Ask about stats, reviews, automations, or next actions..."
          style={{
            border: brutalBorder,
            flex: 1,
            minWidth: 0,
            padding: "0.65rem 0.7rem",
            backgroundColor: theme.colors.card,
            fontFamily: theme.fonts.body,
          }}
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim()}
          aria-label="Send assistant message"
          style={{
            ...brutalButtonPrimary,
            width: 44,
            minWidth: 44,
            padding: 0,
            opacity: isThinking || !input.trim() ? 0.6 : 1,
          }}
        >
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncError, setSyncError] = useState("");
  const [data, setData] = useState(emptyData);
  const [stats, setStats] = useState({
    revenue: "$0",
    leads: 0,
    conversionRate: "0%",
    assetValue: CONFIG.metrics.assetValue,
    topAsset: "N/A",
    communityGrowth: "0%",
    emailGrowth: "0%",
    churnRisk: "Low",
  });
  const [automations, setAutomations] = useState([]);
  const [openRouterKey, setOpenRouterKey] = useState(
    localStorage.getItem('openRouterKey') || '',
  );
  const [assistantMessages, setAssistantMessages] = useState([assistantWelcome]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [assistantError, setAssistantError] = useState('');
  const [intakeData, setIntakeData] = useState(null);
  const [intakeLoading, setIntakeLoading] = useState(false);

  useEffect(() => {
    document.title = `${CONFIG.brand.fullName} Dashboard`;
  }, []);

  const tabs = useMemo(
    () => dashboardConfig.tabs.map((tab) => ({ ...tab, icon: tabIcons[tab.id] })),
    [],
  );

  const currentTabConfig = tabs.find((tab) => tab.id === activeTab);

  const syncEmpireData = async () => {
    setIsSyncing(true);
    setSyncError("");

    try {
      const syncUrl = API_URL.replace("/hermes", "/sync");
      const res = await fetch(syncUrl, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({ message: "sync" }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || `${dashboardConfig.syncFailurePrefix} ${res.status}`,
        );
      }

      const payload = await res.json();
      const snapshot = payload.snapshot || payload;
      const nextData = normalizeData(snapshot);

      setData(nextData);

      const automations = Array.isArray(snapshot.automations) ? snapshot.automations : [];
      setAutomations(automations);

      const sourceStats = snapshot.stats || {};
      setStats({
        revenue: typeof sourceStats.revenue === 'string' ? sourceStats.revenue : '$0',
        leads: typeof sourceStats.leads === 'number' ? sourceStats.leads : 0,
        conversionRate: typeof sourceStats.conversionRate === 'number'
          ? formatConversion(sourceStats.conversionRate)
          : '0%',
        assetValue: formatAssetValue(sourceStats.assetValue),
        topAsset: sourceStats.topAsset || 'N/A',
        communityGrowth: sourceStats.communityGrowth || '0%',
        emailGrowth: sourceStats.emailGrowth || '0%',
        churnRisk: sourceStats.churnRisk || 'Low',
      });
      setLastSync(new Date().toLocaleString());
    } catch (err) {
      setSyncError(err.message || dashboardConfig.syncError);
    } finally {
      setIsSyncing(false);
    }
  };

  const loadIntakeAlerts = async () => {
    setIntakeLoading(true);
    try {
      const intakeUrl = `${API_URL.replace('/hermes', '')}/intake`;
      const res = await fetch(intakeUrl, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ action: 'read' }),
      });

      if (!res.ok) {
        setIntakeData(null);
      } else {
        const payload = await res.json().catch(() => null);
        setIntakeData(payload || null);
      }
    } catch (e) {
      setIntakeData(null);
    } finally {
      setIntakeLoading(false);
    }
  };

  useEffect(() => {
    loadIntakeAlerts();
  }, [lastSync]);

  const handleSaveSettings = () => {
    localStorage.setItem("openRouterKey", openRouterKey.trim());
    setShowSettings(false);
  };

  const sendAssistantMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || isAssistantThinking) return;

    const userMessage = { role: 'user', content: trimmedMessage };
    const nextMessages = [...assistantMessages, userMessage];

    setAssistantMessages(nextMessages);
    setAssistantInput('');
    setAssistantError('');
    setIsAssistantThinking(true);

    try {
      const snapshot = buildAssistantSnapshot({
        stats,
        data: { ...data, automations },
        lastSync,
      });

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          message: trimmedMessage,
          messages: nextMessages,
          context: snapshot,
          conversation: nextMessages,
          agentKey: 'digitallydefined_partner',
          agent: 'digitallydefined_partner',
          notebooks: [
            process.env.NOTEBOOKLM_BRAND_NOTEBOOK,
            process.env.NOTEBOOKLM_REAL_ESTATE_NOTEBOOK,
            process.env.NOTEBOOKLM_FACELESS_NOTEBOOK,
          ].filter(Boolean),
        }),
      });

      const dataRes = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = dataRes?.error || dataRes?.message || 'Hermes request failed';
        throw new Error(errorMsg);
      }

      const reply =
        typeof dataRes?.reply === 'string' && dataRes.reply
          ? dataRes.reply
          : "I didn't get a usable response from Hermes.";

      setAssistantMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'assistant',
          content: reply,
          provider: dataRes?.provider || null,
          model: dataRes?.model || null,
          agent: dataRes?.agent || 'digitallydefined_partner',
        },
      ]);
      setAssistantError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Hermes encountered an error.';
      setAssistantError(message);
      setAssistantMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'assistant',
          content:
            "I couldn't reach Hermes just now. Here is the current dashboard snapshot instead.\n\n" +
            createLocalAssistantReply({ stats, data, lastSync }),
        },
      ]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const handleAssistantSubmit = (event) => {
    event.preventDefault();
    sendAssistantMessage(assistantInput);
  };

  const renderTab = () => {
    if (activeTab === "reputation") return <ReputationTab reviews={data.reviews} />;
    if (activeTab === "intel") return <IntelTab data={data} />;
    if (activeTab === "brain") return <BrainTab aiBrief={data.aiBrief} notion={data.notion} />;
    if (activeTab === "automations") return <AutomationsTab automations={data.automations} />;
    if (activeTab === "notion") return <NotionTab notion={data.notion} />;
    return <CommandTab data={data} stats={stats} />;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.fonts.app,
      }}
    >
      <style>{`
        @keyframes dd-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .dd-dashboard-shell {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <header
        style={{
          borderBottom: brutalBorder,
          padding: "1rem 1.5rem",
          backgroundColor: theme.colors.panel,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <Logo as="div" />
          <p style={{ margin: 0, fontSize: "0.82rem", color: theme.colors.muted }}>
            {CONFIG.brand.tagline}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={syncEmpireData}
            disabled={isSyncing}
            style={{
              ...brutalButtonPrimary,
              padding: "0.55rem 0.8rem",
              opacity: isSyncing ? 0.72 : 1,
            }}
          >
            <RefreshCw
              size={16}
              style={{
                transform: isSyncing ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
            {isSyncing ? dashboardConfig.syncingLabel : dashboardLabels.syncButton}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            style={{
              ...brutalButtonPrimary,
              backgroundColor: theme.colors.card,
              padding: "0.55rem 0.8rem",
            }}
          >
            <Settings size={16} />
            <span>{dashboardLabels.settings}</span>
          </button>
        </div>
      </header>


      <main
        className="dd-dashboard-shell"
        style={{
          padding: "clamp(1rem, 4vw, 1.5rem)",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "1rem",
        }}
      >
        <aside
          style={{
            ...cardStyle,
            padding: "1rem",
            display: "grid",
            gap: "1rem",
            height: "fit-content",
            backgroundColor: theme.colors.panel,
          }}
        >
          <h2 style={{ ...brutalHeading, fontSize: "0.95rem", margin: 0 }}>
            {dashboardLabels.navigation}
          </h2>

          <nav style={{ display: "grid", gap: "0.45rem" }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              const badgeCount =
                tab.id === 'notion' && intakeData
                  ? (intakeData.alerts?.countUnscored || 0) +
                    (intakeData.alerts?.countReadyForReview || 0)
                  : 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    border: brutalBorder,
                    backgroundColor: isActive ? theme.colors.orange : theme.colors.background,
                    color: theme.colors.textPrimary,
                    padding: '0.7rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: theme.fonts.body,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Icon size={16} />
                    {tab.label}
                  </span>
                  {badgeCount > 0 && (
                    <span
                      style={{
                        backgroundColor: theme.colors.darkRed,
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.12rem 0.45rem',
                        border: brutalBorder,
                        backgroundColor: theme.colors.orange,
                      }}
                    >
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div
            style={{
              borderTop: brutalBorder,
              paddingTop: "0.8rem",
              color: syncError ? theme.colors.darkRed : theme.colors.muted,
              fontSize: "0.78rem",
            }}
          >
            {syncError ||
              (lastSync
                ? `${dashboardConfig.lastSyncPrefix} ${lastSync}`
                : dashboardLabels.noSync)}
          </div>
        </aside>

        <section style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div
            style={{
              ...cardStyle,
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.75rem",
              backgroundColor: theme.colors.panel,
            }}
          >
            <MetricCard icon={DollarSign} label={dashboardLabels.metrics.revenue} value={stats.revenue} />
            <MetricCard icon={Users} label={dashboardLabels.metrics.leads} value={stats.leads} />
            <MetricCard icon={TrendingUp} label={dashboardLabels.metrics.conversion} value={stats.conversionRate} />
            <MetricCard icon={FolderHeart} label={dashboardLabels.metrics.assetValue} value={stats.assetValue} />
          </div>

          <div style={{ ...cardStyle, padding: "1rem", minHeight: 220 }}>
            <h1 style={{ ...brutalHeading, margin: "0 0 0.5rem", fontSize: "1.3rem" }}>
              {currentTabConfig?.label}
            </h1>
            {renderTab()}
          </div>

          <DashboardAssistant
            messages={assistantMessages}
            input={assistantInput}
            isThinking={isAssistantThinking}
            assistantError={assistantError}
            onInputChange={setAssistantInput}
            onSubmit={handleAssistantSubmit}
            onQuickPrompt={sendAssistantMessage}
          />
        </section>
      </main>

      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17,17,17,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 40,
            padding: "1rem",
          }}
        >
          <div
            style={{
              ...cardStyle,
              padding: "1rem",
              width: "min(420px, 100%)",
              backgroundColor: theme.colors.background,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                border: brutalBorder,
                background: theme.colors.card,
                cursor: "pointer",
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
              }}
            >
              <X size={16} />
            </button>

            <h2 style={{ ...brutalHeading, fontSize: "1rem", margin: "0 2.2rem 0.5rem 0" }}>
              {dashboardConfig.settingsTitle}
            </h2>

            <p style={{ fontSize: "0.85rem", margin: "0 0 0.85rem", color: theme.colors.muted }}>
              {dashboardConfig.settingsDescription}
            </p>

            <label style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
              <span>{dashboardConfig.openRouterLabel}</span>
              <input
                type="password"
                value={openRouterKey}
                onChange={(event) => setOpenRouterKey(event.target.value)}
                placeholder={dashboardConfig.openRouterPlaceholder}
                style={{
                  border: brutalBorder,
                  padding: "0.6rem 0.7rem",
                  backgroundColor: theme.colors.card,
                  fontFamily: theme.fonts.body,
                }}
              />
            </label>

            <button
              onClick={handleSaveSettings}
              style={{
                ...brutalButtonPrimary,
                width: "100%",
                marginTop: "0.9rem",
                padding: "0.65rem 0.75rem",
              }}
            >
              {dashboardLabels.saveSettings}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
