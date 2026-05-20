import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  DollarSign,
  FolderHeart,
  LayoutDashboard,
  Magnet,
  MessageSquare,
  RefreshCw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import CONFIG from "../config";
import Logo from "../components/Logo";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalCard,
  brutalHeading,
  theme,
} from "../theme";

const dashboardConfig = CONFIG.dashboard;
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
  });
  const [stats, setStats] = useState({
    assetValue: CONFIG.metrics.assetValue,
    activeLeads: CONFIG.metrics.activeLeads,
    siteHealth: CONFIG.metrics.systemHealth,
    avgSentiment: CONFIG.metrics.sentimentIndex,
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
      const sheetsRes = await fetch(googleSheetsDataUrl);

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
        competitors: sheetsData?.competitors || currentData.competitors,
        community: sheetsData?.community || currentData.community,
        leadMagnets: sheetsData?.leadMagnets || currentData.leadMagnets,
        payments: sheetsData?.payments || currentData.payments,
        campaigns: sheetsData?.campaigns || currentData.campaigns,
        notion: notionData?.results || currentData.notion,
      }));

      setStats({
        assetValue: sheetsData?.assetValue || CONFIG.metrics.assetValue,
        activeLeads: sheetsData?.communityCount || CONFIG.metrics.communityCount,
        siteHealth: sheetsData?.siteHealth || CONFIG.metrics.systemHealth,
        avgSentiment: sheetsData?.sentiment || CONFIG.metrics.sentimentIndex,
      });

      setLastSync(new Date().toLocaleTimeString());

      const slackUrl =
        localStorage.getItem("slackWebhookUrl") || CONFIG.integrations.slackWebhookUrl;

      if (slackUrl && !slackUrl.startsWith("YOUR_")) {
        await fetch(slackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "DigitallyDefined dashboard synced." }),
        });
      }
    } catch (error) {
      console.error("SYNC ERROR:", error);
      setSyncError("Failed to sync live data");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncEmpireData();
  }, []);

  const ui = {
    app: {
      backgroundColor: CONFIG.colors.background,
      color: CONFIG.colors.text,
      fontFamily: theme.fonts.app,
    },
    lightCard: {
      ...brutalCard,
      backgroundColor: CONFIG.colors.surface,
    },
    buttonPrimary: {
      ...brutalButtonPrimary,
    },
    buttonDark: {
      backgroundColor: CONFIG.colors.dark,
      color: CONFIG.colors.surface,
      border: brutalBorder,
    },
    input: {
      border: brutalBorder,
      backgroundColor: CONFIG.colors.surface,
      color: CONFIG.colors.text,
    },
  };

  const communityItems =
    rawData.community?.length > 0
      ? rawData.community.slice(0, 5).map((member) => ({
          name: member.memberName || member.name || dashboardConfig.communityFallbackName,
          date: member.joinedDate || dashboardConfig.communityFallbackDate,
          status: member.status || dashboardConfig.communityFallbackStatus,
        }))
      : CONFIG.community.members;

  const campaigns =
    rawData.campaigns?.length > 0
      ? rawData.campaigns.map((campaign) => ({
          name: campaign.campaignName || campaign.name,
          conversion: campaign.conversionRate || campaign.conversion,
        }))
      : CONFIG.intel.campaigns;

  const MarketIntel = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-full p-6 md:p-8" style={ui.lightCard}>
          <h3 className="mb-8 flex items-center gap-3 text-xl font-black uppercase italic">
            <TrendingUp size={24} style={{ color: CONFIG.colors.info }} />
            {dashboardConfig.marketIntelTitle}
          </h3>
          <div className="space-y-4">
            {rawData.competitors?.length > 0 ? (
              rawData.competitors.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-4" style={ui.lightCard}>
                  <div>
                    <p className="text-sm font-bold uppercase">
                      {comp.businessName || comp.name}
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: CONFIG.colors.textMuted }}
                    >
                      {comp.reviewCount || 0} {dashboardConfig.reviewsLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black" style={{ color: CONFIG.colors.warning }}>
                      {comp.marketShare || dashboardConfig.notAvailableLabel}
                    </p>
                    <p
                      className="text-[9px] font-bold uppercase"
                      style={{ color: CONFIG.colors.textMuted }}
                    >
                      {dashboardConfig.shareLabel}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm italic" style={{ color: CONFIG.colors.textMuted }}>
                {dashboardConfig.marketIntelEmpty}
              </p>
            )}
          </div>
        </div>

        <div className="h-full p-6 md:p-8" style={ui.lightCard}>
          <h3 className="mb-8 flex items-center gap-3 text-xl font-black uppercase italic">
            <Magnet size={24} style={{ color: CONFIG.colors.warning }} />
            {dashboardConfig.leadMagnetTitle}
          </h3>
          <div className="space-y-4">
            {rawData.leadMagnets?.length > 0 ? (
              rawData.leadMagnets.map((magnet, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4"
                  style={{ ...ui.lightCard, backgroundColor: CONFIG.colors.panel }}
                >
                  <div>
                    <p className="text-sm font-bold uppercase">
                      {magnet.prospectName || magnet.name}
                    </p>
                    <p
                      className="text-[10px] font-medium uppercase"
                      style={{ color: CONFIG.colors.info }}
                    >
                      {magnet.assetDownloaded || magnet.asset}
                    </p>
                  </div>
                  <span
                    className="border px-2 py-1 text-[9px] font-bold uppercase"
                    style={{
                      borderColor: CONFIG.colors.border,
                      backgroundColor:
                        magnet.nurtureLevel === dashboardConfig.hotNurtureValue
                          ? CONFIG.colors.danger
                          : CONFIG.colors.hotTint,
                      color:
                        magnet.nurtureLevel === dashboardConfig.hotNurtureValue
                          ? CONFIG.colors.surface
                          : CONFIG.colors.text,
                    }}
                  >
                    {magnet.nurtureLevel || dashboardConfig.nurtureFallback}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm italic" style={{ color: CONFIG.colors.textMuted }}>
                {dashboardConfig.leadMagnetEmpty}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ReputationManager = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="p-6 md:p-8" style={ui.lightCard}>
        <h3 className="mb-8 flex items-center gap-3 text-xl font-black uppercase italic">
          <ShieldAlert size={24} style={{ color: CONFIG.colors.danger }} />
          {dashboardConfig.reputationTitle}
        </h3>

        <div className="space-y-4">
          {rawData.reviews?.length > 0 ? (
            rawData.reviews.map((rev, i) => {
              const hasReply =
                rev.aiDraftedResponse &&
                rev.aiDraftedResponse !== dashboardConfig.aiReplyPlaceholder;

              return (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-6 p-6 md:flex-row"
                  style={ui.lightCard}
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Star
                        size={14}
                        style={{ color: CONFIG.colors.gold, fill: CONFIG.colors.gold }}
                      />
                      <span className="text-xs font-bold uppercase">{rev.name}</span>

                      <span
                        className="border px-2 py-0.5 text-[9px] font-bold uppercase"
                        style={{
                          borderColor: CONFIG.colors.border,
                          backgroundColor:
                            rev.sentiment === dashboardConfig.negativeSentimentValue
                              ? CONFIG.colors.danger
                              : CONFIG.colors.success,
                          color: CONFIG.colors.surface,
                        }}
                      >
                        {rev.sentiment || dashboardConfig.analyzingLabel}
                      </span>
                    </div>

                    <p
                      className="mb-4 text-sm italic"
                      style={{ color: CONFIG.colors.textMuted }}
                    >
                      "{rev.reviewText || rev.text}"
                    </p>

                    <div
                      className="p-4"
                      style={{
                        backgroundColor: CONFIG.colors.panel,
                        borderLeft: `4px solid ${CONFIG.colors.warning}`,
                      }}
                    >
                      <p className="mb-1 text-[10px] font-bold uppercase">
                        {dashboardConfig.aiReplyLabel}
                      </p>
                      <p className="text-sm font-medium">
                        {rev.aiDraftedResponse || dashboardConfig.aiReplyPlaceholder}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!hasReply}
                    className="h-fit self-center px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    style={ui.buttonPrimary}
                    title={
                      hasReply
                        ? "Deploy logic not connected yet"
                        : "No drafted reply available"
                    }
                  >
                    {dashboardConfig.deployReplyLabel}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="py-12 text-center" style={{ color: CONFIG.colors.textMuted }}>
              {dashboardConfig.reputationEmpty}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const CommandTab = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: dashboardConfig.stats.assetValue,
            val: stats.assetValue,
            icon: DollarSign,
            color: CONFIG.colors.successTint,
          },
          {
            label: dashboardConfig.stats.community,
            val: stats.activeLeads,
            icon: Users,
            color: CONFIG.colors.infoTint,
          },
          {
            label: dashboardConfig.stats.systemHealth,
            val: stats.siteHealth,
            icon: ShieldCheck,
            color: CONFIG.colors.warningTint,
          },
          {
            label: dashboardConfig.stats.sentimentIndex,
            val: stats.avgSentiment,
            icon: MessageSquare,
            color: CONFIG.colors.dangerTint,
          },
        ].map((s, i) => (
          <div key={i} className="p-6 md:p-8" style={ui.lightCard}>
            <div className="mb-6 flex items-start justify-between">
              <div className="p-2" style={{ border: brutalBorder, backgroundColor: s.color }}>
                <s.icon size={18} />
              </div>
              <ArrowUpRight size={14} style={{ color: CONFIG.colors.textMuted }} />
            </div>
            <p
              className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: CONFIG.colors.textMuted }}
            >
              {s.label}
            </p>
            <p
              className="text-4xl font-bold"
              style={{ color: CONFIG.colors.text, fontFamily: "'Inter', sans-serif" }}
            >
              {s.val}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="p-6 md:p-8" style={ui.lightCard}>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-lg font-bold uppercase italic">
                <FolderHeart size={20} /> {dashboardConfig.communityFeedTitle}
              </h3>
              <button
                onClick={syncEmpireData}
                className="flex items-center gap-2 border-b pb-1 text-[10px] font-bold uppercase"
                style={{ borderColor: CONFIG.colors.border }}
              >
                <RefreshCw size={10} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing
                  ? dashboardConfig.syncingLabel
                  : `${dashboardConfig.lastSyncPrefix} ${
                      lastSync || dashboardConfig.lastSyncFallback
                    }`}
              </button>
            </div>

            <div className="space-y-3">
              {communityItems.length > 0 ? (
                communityItems.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 transition-all"
                    style={ui.lightCard}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-xs font-bold italic"
                        style={{ color: CONFIG.colors.textMuted }}
                      >
                        0{i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold uppercase">{member.name}</p>
                        <p
                          className="text-[10px] uppercase tracking-widest"
                          style={{ color: CONFIG.colors.textMuted }}
                        >
                          {member.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 text-[9px] font-bold uppercase"
                      style={{ border: brutalBorder }}
                    >
                      {member.status}
                    </span>
                  </div>
                ))
              ) : (
                <p
                  className="py-8 text-center text-sm italic uppercase tracking-widest"
                  style={{ color: CONFIG.colors.textMuted }}
                >
                  {dashboardConfig.communityFeedEmpty}
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col justify-between border p-8"
          style={{
            backgroundColor: CONFIG.colors.dark,
            color: CONFIG.colors.surface,
            borderColor: CONFIG.colors.border,
          }}
        >
          <div>
            <h4
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: CONFIG.colors.warning }}
            >
              {dashboardConfig.intelTitle}
            </h4>
            <div className="mb-8">
              {campaigns.length > 0 ? (
                <div>
                  <p
                    className="text-xl font-black uppercase italic"
                    style={{ color: CONFIG.colors.info }}
                  >
                    {campaigns[0].name}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: CONFIG.colors.bone }}>
                    {dashboardConfig.conversionLabel}{" "}
                    <span className="font-bold">
                      {String(campaigns[0].conversion).includes("%")
                        ? campaigns[0].conversion
                        : formatConversion(campaigns[0].conversion)}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-lg font-medium italic">{dashboardConfig.intelEmpty}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("intel")}
            className="w-fit border-b text-[10px] font-bold uppercase tracking-widest"
            style={{
              borderColor: CONFIG.colors.whiteBorderSoft,
              color: CONFIG.colors.surface,
            }}
          >
            {dashboardConfig.intelCta}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden" style={ui.app}>
      <div
        className="fixed inset-x-0 top-0 z-30 p-4 md:hidden"
        style={{ borderBottom: brutalBorder, backgroundColor: CONFIG.colors.surface }}
      >
        <div className="flex items-center justify-between gap-4">
          <Logo as="div" className="text-sm tracking-tighter" />
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest"
            style={ui.lightCard}
          >
            <Settings size={14} /> {dashboardConfig.mobileKeysLabel}
          </button>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center justify-center gap-2 px-3 py-3 text-[10px] font-bold uppercase tracking-widest"
              style={activeTab === item.id ? ui.buttonDark : ui.lightCard}
            >
              <item.icon size={14} /> {item.label}
            </button>
          ))}
        </nav>
      </div>

      <aside
        className="z-20 hidden w-64 flex-col justify-between md:flex"
        style={{ borderRight: brutalBorder, backgroundColor: CONFIG.colors.surface }}
      >
        <div className="p-6">
          <Logo as="div" className="mb-12 p-4 text-lg tracking-tighter" style={ui.lightCard} />

          <nav className="space-y-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full px-5 py-4 text-[10px] font-bold uppercase tracking-widest transition-all"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  border: activeTab === item.id ? brutalBorder : "1px solid transparent",
                  backgroundColor: activeTab === item.id ? CONFIG.colors.dark : "transparent",
                  color: activeTab === item.id ? CONFIG.colors.surface : CONFIG.colors.text,
                }}
              >
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6" style={{ borderTop: brutalBorder }}>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all"
            style={{
              ...ui.lightCard,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Settings size={14} /> {dashboardConfig.systemKeysLabel}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 pt-44 md:p-12 md:pt-12 lg:p-16">
        <header className="mx-auto mb-16 max-w-6xl">
          <p
            className="mb-2 text-[9px] font-bold uppercase tracking-[0.4em]"
            style={{ color: CONFIG.colors.warning }}
          >
            {dashboardConfig.headerEyebrowPrefix} {CONFIG.brand.version}
          </p>
          <h2
            className="text-5xl tracking-tighter"
            style={{ ...brutalHeading, color: CONFIG.colors.text }}
          >
            {activeTab === "dashboard"
              ? dashboardConfig.dashboardTitle
              : tabs.find((tab) => tab.id === activeTab)?.label}
          </h2>
        </header>

        <div className="mx-auto max-w-6xl">
          {syncError && (
            <div
              className="mb-8 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em]"
              style={{
                border: `1px solid ${CONFIG.colors.danger}`,
                backgroundColor: CONFIG.colors.dangerTint,
                color: CONFIG.colors.danger,
              }}
            >
              {syncError}
            </div>
          )}

          {activeTab === "dashboard" && <CommandTab />}
          {activeTab === "reputation" && <ReputationManager />}
          {activeTab === "intel" && <MarketIntel />}
          {activeTab === "brain" && (
            <div className="py-20 text-center" style={{ border: `2px dashed ${CONFIG.colors.border}` }}>
              <p
                className="mb-4 text-4xl font-black uppercase italic"
                style={{ color: CONFIG.colors.ghostText }}
              >
                {dashboardConfig.brainTitle}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest">
                {dashboardConfig.brainSubtitle}
              </p>
            </div>
          )}
        </div>
      </main>

      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: CONFIG.colors.overlayLight }}
        >
          <div className="relative w-full max-w-xl p-8 md:p-12" style={ui.lightCard}>
            <button
              onClick={() => setShowSettings(false)}
              className="absolute right-6 top-6 transition-all hover:rotate-90"
            >
              <X size={24} />
            </button>

            <h3 className="mb-8 text-2xl font-black uppercase italic">
              {dashboardConfig.settingsTitle}
            </h3>

            <label
              className="mb-1 block text-[9px] font-bold uppercase tracking-widest"
              style={{ color: CONFIG.colors.textMuted }}
            >
              {dashboardConfig.openRouterLabel}
            </label>

            <input
              type="password"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="w-full p-4 text-lg font-medium focus:outline-none"
              style={ui.input}
              placeholder={dashboardConfig.openRouterPlaceholder}
            />

            <button
              onClick={() => {
                localStorage.setItem("openRouterKey", openRouterKey);
                setShowSettings(false);
              }}
              className="mt-6 w-full px-6 py-3 text-sm font-bold uppercase tracking-[0.2em]"
              style={ui.buttonPrimary}
            >
              {dashboardConfig.saveKeysLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;