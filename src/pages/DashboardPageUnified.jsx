import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
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
import { getSupabaseEdgeUrl, getSupabaseEdgeHeaders } from "../lib/supabase-edge";
import FadeInSection from "../components/FadeInSection";
import { ddBrand, ddSection, ddContainer, ddGrid, ddStickyCta } from "../brand/dd-brand-tokens";

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

const API_URL = getSupabaseEdgeUrl();

const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";
const API_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

if (!API_KEY) {
  console.warn("[Dashboard] VITE_DASHBOARD_API_KEY not configured");
}

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
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
  <div
    style={{
      ...cardStyle,
      padding: "0.9rem",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
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

function CommandTab({ data, stats }) {
  return (
    <FadeInSection>
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
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
    </FadeInSection>
  );
}

function ReputationTab({ reviews }) {
  if (!reviews.length) {
    return <EmptyState>{dashboardConfig.reputationEmpty}</EmptyState>;
  }

  return (
    <FadeInSection>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {reviews.map((review, index) => (
          <article
            key={`${review.name}-${index}`}
            style={{
              ...cardStyle,
              padding: "0.9rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
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
    </FadeInSection>
  );
}

function IntelTab({ data }) {
  return (
    <FadeInSection>
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
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
                style={{
                  ...cardStyle,
                  padding: "0.75rem",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
    </FadeInSection>
  );
}

function BrainTab({ aiBrief }) {
  if (!aiBrief) {
    return <EmptyState>No AI brief available. Click Sync Vault to generate one.</EmptyState>;
  }

  const sections = [
    ["What's Working", aiBrief.working, CONFIG.colors.success],
    ["What's Slipping", aiBrief.slipping, theme.colors.darkRed],
    ["Next Actions", aiBrief.nextActions, theme.colors.orange],
  ];

  return (
    <FadeInSection>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {sections.map(([title, items, color]) =>
          items?.length ? (
            <section
              key={title}
              style={{
                ...cardStyle,
                padding: "0.9rem",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3
                style={{
                  ...brutalHeading,
                  margin: "0 0 0.5rem",
                  color,
                  fontSize: "0.95rem",
                }}
              >
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
      </div>
    </FadeInSection>
  );
}

function AutomationsTab({ automations }) {
  if (!automations.length) {
    return (
      <EmptyState>
        {dashboardConfig.automationsEmpty ||
          "No automations configured yet. Set up workflows in your backend to automate reviews, campaigns, and community tasks."}
      </EmptyState>
    );
  }

  return (
    <FadeInSection>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {automations.map((automation, index) => (
          <div
            key={`${automation.id || automation.name || index}`}
            style={{
              ...cardStyle,
              padding: "0.9rem",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
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
    </FadeInSection>
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
    <FadeInSection>
      <section
        style={{
          ...cardStyle,
          padding: "0.9rem",
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <h2 style={{ ...brutalHeading, margin: 0, fontSize: "1rem" }}>
          Dashboard Assistant
        </h2>
        <div
          style={{
            ...cardStyle,
            padding: "0.75rem",
            background: ddBrand.tokens.background,
            minHeight: "120px",
          }}
        >
          {messages.length === 0 && (
            <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.9rem" }}>
              {assistantWelcome.content}
            </p>
          )}
          {messages.map((message, idx) => (
            <div key={idx} style={{ marginBottom: "0.5rem" }}>
              <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>{" "}
              {message.content}
            </div>
          ))}
          {isThinking && <p style={{ margin: 0, color: theme.colors.muted }}>Thinking...</p>}
          {assistantError && (
            <p style={{ margin: 0, color: theme.colors.darkRed }}>{assistantError}</p>
          )}
        </div>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
        >
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask the assistant..."
            className="dd-input"
            style={{ flex: 1, minWidth: "180px" }}
          />
          <button type="submit" className="dd-button dd-button--primary" disabled={isThinking}>
            <Send size={16} />
            Send
          </button>
        </form>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onQuickPrompt(prompt)}
              className="dd-button dd-button--outline"
              style={{ fontSize: "0.78rem", padding: "10px 14px" }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

export default function DashboardPageUnified() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    revenue: "$0",
    leads: "0",
    conversionRate: "0%",
    assetValue: "$0",
    topAsset: "N/A",
    communityGrowth: "0",
    emailGrowth: "0",
    churnRisk: "N/A",
  });
  const [payload, setPayload] = useState({});
  const [data, setData] = useState(emptyData);
  const [lastSync, setLastSync] = useState("No sync yet");
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantInput, setAssistantInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [assistantError, setAssistantError] = useState("");

  // Data fetching restored: keeps unified UI, removes blank dashboard
  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      try {
        const response = await fetch("/api/hermes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "dashboard" }),
        });
        const result = await response.json();
        if (!isMounted) return;
        if (result?.success && result.data) {
          const payload = result.data;
          setPayload(payload);
          setStats({
            revenue: formatCurrency(payload.revenue),
            leads: formatCount(payload.leads),
            conversionRate: formatConversion(payload.conversionRate),
            assetValue: formatAssetValue(payload.assetValue),
            topAsset: payload.topAsset || "N/A",
            communityGrowth: formatCount(payload.communityGrowth),
            emailGrowth: formatCount(payload.emailGrowth),
            churnRisk: payload.churnRisk || "N/A",
          });
          setData(normalizeData(payload));
          setLastSync(new Date().toLocaleString());
        } else {
          setData((current) => ({ ...current, sourceHealth: { api: result?.error || "Unavailable" } }));
        }
      } catch (error) {
        if (isMounted) {
          setData((current) => ({ ...current, sourceHealth: { api: error.message || "Unavailable" } }));
        }
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const tabs = [
    { id: "dashboard", label: "Command", icon: LayoutDashboard },
    { id: "reputation", label: "Reputation", icon: ShieldCheck },
    { id: "intel", label: "Intel", icon: BarChart3 },
    { id: "brain", label: "Brain", icon: BrainCircuit },
    { id: "automations", label: "Automations", icon: Workflow },
    { id: "notion", label: "Notion", icon: Bot },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: ddBrand.tokens.background,
        color: ddBrand.tokens.text,
        fontFamily: ddBrand.typography.body.fontFamily,
      }}
    >
      <header
        style={{
          borderBottom: ddBrand.border,
          backgroundColor: ddBrand.tokens.surface,
          padding: "18px 24px",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            ...ddContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <Logo as="div" style={{ fontSize: "clamp(1.1rem, 2vw, 1.45rem)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ ...brutalEyebrow, color: theme.colors.muted }}>
              {dashboardConfig.headerEyebrowPrefix || "Proprietary OS"}
            </span>
            <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              {dashboardConfig.dashboardTitle || "Own Your Power."}
            </span>
          </div>
        </div>
      </header>

      <main style={ddSection}>
        <div style={ddContainer}>
          <FadeInSection>
            <div
              style={{
                ...cardStyle,
                padding: "1rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`dd-button ${active ? "dd-button--selected" : "dd-button--outline"}`}
                      style={{ fontSize: "0.8rem", padding: "10px 14px" }}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button
                  className="dd-button dd-button--primary"
                  style={{ fontSize: "0.8rem", padding: "10px 14px" }}
                >
                  <RefreshCw size={16} />
                  {dashboardLabels.syncButton}
                </button>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div style={compactGrid}>
              <MetricCard icon={DollarSign} label={dashboardLabels.metrics.revenue} value={stats.revenue} />
              <MetricCard icon={Users} label={dashboardLabels.metrics.leads} value={stats.leads} />
              <MetricCard icon={TrendingUp} label={dashboardLabels.metrics.conversion} value={stats.conversionRate} />
              <MetricCard icon={FolderHeart} label={dashboardLabels.metrics.assetValue} value={formatAssetValue(stats.assetValue)} />
            </div>
          </FadeInSection>

          <FadeInSection delay={150}>
            <div
              style={{
                ...cardStyle,
                padding: "1rem",
                minHeight: "320px",
              }}
            >
              {activeTab === "dashboard" && (
                <CommandTab data={data} stats={stats} />
              )}
              {activeTab === "reputation" && (
                <ReputationTab reviews={data.reviews} />
              )}
              {activeTab === "intel" && (
                <IntelTab data={data} />
              )}
              {activeTab === "brain" && (
                <BrainTab aiBrief={data.aiBrief} />
              )}
              {activeTab === "automations" && (
                <AutomationsTab automations={data.automations} />
              )}
              {activeTab === "notion" && (
                <EmptyState>Notion DB integration pending.</EmptyState>
              )}
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <DashboardAssistant
              messages={assistantMessages}
              input={assistantInput}
              isThinking={isThinking}
              assistantError={assistantError}
              onInputChange={setAssistantInput}
              onSubmit={() => {}}
              onQuickPrompt={() => {}}
            />
          </FadeInSection>
        </div>
      </main>

      <a href="#free-calculator" style={ddStickyCta}>
        Run Calculator <TrendingUp size={16} />
      </a>
    </div>
  );
}
