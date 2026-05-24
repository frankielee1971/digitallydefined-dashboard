import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  DollarSign,
  FolderHeart,
  LayoutDashboard,
  RefreshCw,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import CONFIG from "../config";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalCard,
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

const googleSheetsDataUrl =
  import.meta.env.VITE_SHEETS_API_URL || dashboardConfig.defaultSheetsUrl;

const tabIcons = {
  dashboard: LayoutDashboard,
  reputation: ShieldCheck,
  intel: BarChart3,
  brain: BrainCircuit,
};

const formatConversion = (value) =>
  `${(Number(value || 0) * 100).toFixed(1)}%`;

const formatAssetValue = (value) => {
  if (typeof value === "number") return `$${value.toLocaleString()}`;
  if (typeof value === "string" && value.trim() !== "") return value;
  return CONFIG.metrics.assetValue;
};

const formatSiteHealth = (value) => {
  if (typeof value === "number") {
    if (value <= 1) return `${Math.round(value * 100)}%`;
    return `${Math.round(value)}%`;
  }
  if (typeof value === "string" && value.trim() !== "") return value;
  return CONFIG.metrics.systemHealth;
};

const trendSymbol = (trend) => {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
};

function BrandLogo() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid #111111",
        padding: "0.5rem 0.75rem",
        backgroundColor: "#fffcf9",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
      aria-label="DigitallyDefined logo"
    >
      <span
        style={{
          fontFamily: "Inter, DM Sans, Arial, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#111111",
          letterSpacing: "-0.03em",
          fontStyle: "normal",
        }}
      >
        Digitally
      </span>
      <span
        style={{
          fontFamily: "Inter, DM Sans, Arial, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#f18b25",
          letterSpacing: "-0.03em",
          fontStyle: "italic",
          marginLeft: "0.06rem",
        }}
      >
        Defined
      </span>
    </div>
  );
}

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncError, setSyncError] = useState("");
  const [rawData, setRawData] = useState({
    reviews: [],
    competitors: [],
    community: [],
    leadMagnets: [],
    payments: [],
    campaigns: [],
    notion: [],
    assets: [],
    email: [],
    alerts: [],
    aiBrief: null,
  });

  const [stats, setStats] = useState({
    assetValue: CONFIG.metrics.assetValue,
    activeLeads: CONFIG.metrics.activeLeads,
    siteHealth: CONFIG.metrics.systemHealth,
    avgSentiment: CONFIG.metrics.sentimentIndex,
    revenue: "$0",
    leads: 0,
    communityGrowth: "0%",
    emailGrowth: "0%",
    conversionRate: "0%",
    topAsset: "N/A",
    churnRisk: "Low",
  });

  const getStored = (key) => localStorage.getItem(key) || "";
  const [openRouterKey, setOpenRouterKey] = useState(getStored("openRouterKey"));

  useEffect(() => {
    document.title = `${CONFIG.brand.fullName} Dashboard`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", CONFIG.seo.description);
    }
  }, []);

  const tabs = useMemo(
    () =>
      dashboardConfig.tabs.map((tab) => ({
        ...tab,
        icon: tabIcons[tab.id],
      })),
    []
  );

  const normalizeReview = (review = {}) => ({
    ...review,
    name: review.name || review.reviewerName || "Anonymous",
    reviewText: review.reviewText || review.text || "",
    aiDraftedResponse:
      review.aiDraftedResponse ||
      review.aIDraftedResponse ||
      review.aiResponse ||
      "",
  });

  const syncEmpireData = async () => {
    setIsSyncing(true);
    setSyncError("");

    try {
      const freshUrl = `${googleSheetsDataUrl}${
        googleSheetsDataUrl.includes("?") ? "&" : "?"
      }t=${Date.now()}`;

      const sheetsRes = await fetch(freshUrl, {
        cache: "no-store",
      });

      if (!sheetsRes.ok) {
        throw new Error(`${dashboardConfig.syncFailurePrefix} ${sheetsRes.status}`);
      }

      const sheetsData = await sheetsRes.json();

      const notionToken = localStorage.getItem("notionToken");
      const notionDbId = localStorage.getItem("notionDbId");
      let notionData = null;

      if (notionToken && notionDbId) {
        const notionRes = await fetch(
          `https://api.notion.com/v1/databases/${notionDbId}/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${notionToken}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (notionRes.ok) {
          notionData = await notionRes.json();
        }
      }

      setRawData((currentData) => ({
        ...currentData,
        reviews: Array.isArray(sheetsData?.reviews)
          ? sheetsData.reviews.map(normalizeReview)
          : currentData.reviews,
        competitors: Array.isArray(sheetsData?.competitors)
          ? sheetsData.competitors
          : currentData.competitors,
        community: Array.isArray(sheetsData?.community)
          ? sheetsData.community
          : currentData.community,
        leadMagnets: Array.isArray(sheetsData?.leadMagnets)
          ? sheetsData.leadMagnets
          : currentData.leadMagnets,
        payments: Array.isArray(sheetsData?.payments)
          ? sheetsData.payments
          : currentData.payments,
        campaigns: Array.isArray(sheetsData?.campaigns)
          ? sheetsData.campaigns
          : currentData.campaigns,
        assets: Array.isArray(sheetsData?.assets)
          ? sheetsData.assets
          : currentData.assets,
        email: Array.isArray(sheetsData?.email)
          ? sheetsData.email
          : currentData.email,
        alerts: Array.isArray(sheetsData?.alerts)
          ? sheetsData.alerts
          : currentData.alerts,
        notion: notionData || currentData.notion,
        aiBrief: sheetsData?.aiBrief || currentData.aiBrief,
      }));

      const newStats = {
        assetValue: formatAssetValue(sheetsData?.assetValue),
        activeLeads:
          typeof sheetsData?.activeLeads === "number"
            ? sheetsData.activeLeads
            : CONFIG.metrics.activeLeads,
        siteHealth: formatSiteHealth(sheetsData?.siteHealth),
        avgSentiment:
          typeof sheetsData?.avgSentiment === "number"
            ? sheetsData.avgSentiment.toFixed(2)
            : CONFIG.metrics.sentimentIndex,
        revenue: sheetsData?.revenue || "$0",
        leads: sheetsData?.leads || 0,
        communityGrowth: sheetsData?.communityGrowth || "0%",
        emailGrowth: sheetsData?.emailGrowth || "0%",
        conversionRate: sheetsData?.conversionRate
          ? formatConversion(sheetsData.conversionRate)
          : "0%",
        topAsset: sheetsData?.topAsset || "N/A",
        churnRisk: sheetsData?.churnRisk || "Low",
      };

      setStats(newStats);
      setLastSync(new Date().toLocaleString());
    } catch (err) {
      console.error(err);
      setSyncError(err.message || "Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem("openRouterKey", openRouterKey.trim());
    setShowSettings(false);
  };

  const currentTabConfig = tabs.find((tab) => tab.id === activeTab);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fffcf9",
        color: "#111111",
        fontFamily: theme.fonts.app,
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #111111",
          padding: "1rem 1.5rem",
          backgroundColor: "#fffaf5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <BrandLogo />
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: "#5f5f5f",
              }}
            >
              {dashboardConfig.tagline}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={syncEmpireData}
            disabled={isSyncing}
            style={{
              ...brutalButtonPrimary,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.8rem",
              fontSize: "0.85rem",
              backgroundColor: "#f18b25",
              color: "#111111",
              border: "1px solid #111111",
              boxShadow: "4px 4px 0 #111111",
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
              border: "1px solid #111111",
              backgroundColor: "#fffcf9",
              padding: "0.45rem 0.7rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.8rem",
              boxShadow: "4px 4px 0 #111111",
            }}
          >
            <Settings size={16} />
            <span>{dashboardLabels.settings}</span>
          </button>
        </div>
      </header>

      <main
        style={{
          padding: "1.5rem",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "1rem",
        }}
      >
        <aside
          style={{
            ...brutalCard,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            height: "fit-content",
            backgroundColor: "#fffaf5",
            border: "1px solid #111111",
            boxShadow: "6px 6px 0 #111111",
            borderRadius: 0,
          }}
        >
          <div>
            <h2
              style={{
                ...brutalHeading,
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
              }}
            >
              {dashboardLabels.navigation}
            </h2>

            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
              }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      border: "1px solid #111111",
                      backgroundColor: isActive ? "#f18b25" : "#fffcf9",
                      color: "#111111",
                      padding: "0.65rem 0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      boxShadow: isActive ? "3px 3px 0 #111111" : "none",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                      }}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </span>

                    {tab.badge && (
                      <span
                        style={{
                          border: "1px solid #111111",
                          padding: "0.1rem 0.4rem",
                          fontSize: "0.7rem",
                          backgroundColor: "#fffaf5",
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "0.75rem",
              borderTop: "1px dashed #111111",
              fontSize: "0.75rem",
            }}
          >
            <p style={{ margin: 0, marginBottom: "0.3rem" }}>
              {lastSync
                ? `${dashboardConfig.lastSyncPrefix} ${lastSync}`
                : dashboardLabels.noSync}
            </p>

            {syncError && (
              <p
                style={{
                  margin: 0,
                  color: "#8b1a0a",
                }}
              >
                {syncError}
              </p>
            )}
          </div>
        </aside>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              ...brutalCard,
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "0.75rem",
              backgroundColor: "#fffaf5",
              border: "1px solid #111111",
              boxShadow: "6px 6px 0 #111111",
              borderRadius: 0,
            }}
          >
            <MetricCard
              icon={DollarSign}
              label={dashboardLabels.metrics.revenue}
              value={stats.revenue}
              trend={trendSymbol("up")}
            />
            <MetricCard
              icon={Users}
              label={dashboardLabels.metrics.leads}
              value={stats.leads}
              trend={trendSymbol("up")}
            />
            <MetricCard
              icon={TrendingUp}
              label={dashboardLabels.metrics.conversion}
              value={stats.conversionRate}
              trend={trendSymbol("up")}
            />
            <MetricCard
              icon={FolderHeart}
              label={dashboardLabels.metrics.assetValue}
              value={stats.assetValue}
              trend={trendSymbol("up")}
            />
          </div>

          <div
            style={{
              ...brutalCard,
              padding: "1rem",
              minHeight: 200,
              backgroundColor: "#fffaf5",
              border: "1px solid #111111",
              boxShadow: "6px 6px 0 #111111",
              borderRadius: 0,
            }}
          >
            <h2
              style={{
                ...brutalHeading,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              {currentTabConfig?.label}
            </h2>

            <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
              {currentTabConfig?.description ||
                "Configure this tab content in your dashboard config."}
            </p>
          </div>
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
          }}
        >
          <div
            style={{
              ...brutalCard,
              padding: "1rem",
              width: "min(420px, 90vw)",
              backgroundColor: "#fffcf9",
              position: "relative",
              border: "1px solid #111111",
              boxShadow: "6px 6px 0 #111111",
              borderRadius: 0,
            }}
          >
            <button
              onClick={() => setShowSettings(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>

            <h2
              style={{
                ...brutalHeading,
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              {dashboardConfig.settingsTitle}
            </h2>

            <p
              style={{
                fontSize: "0.8rem",
                marginBottom: "0.75rem",
              }}
            >
              {dashboardConfig.settingsDescription}
            </p>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                fontSize: "0.8rem",
                marginBottom: "0.75rem",
              }}
            >
              <span>{dashboardConfig.openRouterLabel}</span>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder={dashboardConfig.openRouterPlaceholder}
                style={{
                  border: "1px solid #111111",
                  padding: "0.5rem 0.6rem",
                  borderRadius: 0,
                  backgroundColor: "#ffffff",
                }}
              />
            </label>

            <button
              onClick={handleSaveSettings}
              style={{
                ...brutalButtonPrimary,
                width: "100%",
                padding: "0.5rem 0.75rem",
                fontSize: "0.85rem",
                backgroundColor: "#f18b25",
                color: "#111111",
                border: "1px solid #111111",
                boxShadow: "4px 4px 0 #111111",
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

const MetricCard = ({ icon: Icon, label, value, trend }) => (
  <div
    style={{
      border: "1px solid #111111",
      padding: "0.75rem",
      backgroundColor: "#ffffff",
      boxShadow: "4px 4px 0 #111111",
      borderRadius: 0,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.4rem",
      }}
    >
      <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>{label}</span>
      <Icon size={16} />
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: "1rem" }}>{value}</span>
      <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{trend}</span>
    </div>
  </div>
);

export default DashboardPage;