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

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "healthy":
    case "success":
    case "low":
      return {
        bg: CONFIG.colors.successTint,
        text: CONFIG.colors.text,
      };
    case "watch":
    case "warning":
    case "medium":
      return {
        bg: CONFIG.colors.warningTint,
        text: CONFIG.colors.text,
      };
    case "at-risk":
    case "critical":
    case "high":
      return {
        bg: CONFIG.colors.dangerTint,
        text: CONFIG.colors.danger,
      };
    default:
      return {
        bg: CONFIG.colors.panel,
        text: CONFIG.colors.text,
      };
  }
};

const trendSymbol = (trend) => {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
};

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
        competitors: 