export const CONFIG = {
  brand: {
    // Set a logo filename from /public to render an image logo. Leave empty to use logoText.
    logoImage: "",
    // Change the text used when no logo image is provided.
    logoText: "DIGITALLYDEFINED",
    // Change the lighter first half of the logo wordmark.
    nameLight: "DIGITALLY",
    // Change the bold or accented second half of the logo wordmark.
    nameBold: "DEFINED",
    // Change the full business or product name.
    fullName: "DigitallyDefined",
    // Change the brand tagline shown across the experience.
    tagline: "The Reputation OS for Women Who Mean Business.",
    // Change the product or operating system version label.
    version: "2.0",
  },
  aesthetic: {
    // Change the overall visual direction used across the experience.
    philosophy: "Soft Brutalism",
    // Shared visual tokens used by all pages.
    tokens: {
      colors: {
        background: "#FFFCF9",
        card: "#FFFFFF",
        text: {
          primary: "#2D3748",
          dark: "#111111",
        },
        accents: {
          orange: "#F18B25",
          aquaBlue: "#47B7D4",
          darkRed: "#C20F0A",
        },
      },
      typography: {
        headings: {
          font: "Inter",
          weight: 900,
          style: "italic",
          transform: "uppercase",
          letterSpacing: "-0.05em",
        },
        body: {
          font: "DM Sans",
          weights: [400, 500, 700],
          lineHeight: "1.6",
        },
      },
      geometry: {
        borderWidth: "1px",
        borderColor: "#111111",
        borderRadius: "0px",
        shadows: "none",
      },
      layout: {
        spacing: "24px",
        gridGap: "32px",
        containerMaxWidth: "1100px",
      },
    },
    rules: [
      "NEVER use border-radius higher than 0px.",
      "NEVER use box-shadows or drop-shadows.",
      "ALL cards must have a 1px solid black border (#111).",
      "Headings must always be Inter Bold and Uppercase.",
      "Primary buttons use Orange (#F18B25), Secondary use Aqua Blue (#47B7D4).",
      "Background must remain Off-White/Cream (#FFFCF9) for maximum contrast.",
    ],
  },
  colors: {
    // Change the primary page background color.
    background: "#FFFCF9",
    // Change the alternate section background color.
    backgroundAlt: "#F4EFE8",
    // Change the darkest brand surface color.
    dark: "#111111",
    // Change the primary highlight color.
    primary: "#47B7D4",
    // Change the accent highlight color.
    accent: "#F18B25",
    // Change the default text color.
    text: "#2D3748",
    // Change the muted or secondary text color.
    textMuted: "#6B7280",
    // Change the default border color.
    border: "#111111",
    // Change the default light card color.
    surface: "#FFFFFF",
    // Change the light button or light-on-dark text color.
    bone: "#FFF7ED",
    // Change the border color used on dark surfaces.
    darkBorder: "#333333",
    // Change the success status color.
    success: "#16A34A",
    // Change the soft success background tint.
    successTint: "#DCFCE7",
    // Change the informational highlight color.
    info: "#47B7D4",
    // Change the soft informational background tint.
    infoTint: "rgba(71, 183, 212, 0.1)",
    // Change the warning or heat color.
    warning: "#F18B25",
    // Change the soft warning background tint.
    warningTint: "rgba(241, 139, 37, 0.1)",
    // Change the negative or alert color.
    danger: "#C20F0A",
    // Change the soft negative background tint.
    dangerTint: "#FEF2F2",
    // Change the neutral gray background used in panels.
    panel: "#F9FAFB",
    // Change the darker feature card surface.
    featureSurface: "#1F2937",
    // Change the gold highlight color.
    gold: "#EAB308",
    // Change the soft orange tag background.
    hotTint: "#FED7AA",
    // Change the soft dark text overlay color.
    ghostText: "rgba(45, 55, 72, 0.12)",
    // Change the light modal overlay color.
    overlayLight: "rgba(255, 255, 255, 0.9)",
    // Change the muted light text color used on dark sections.
    boneMuted: "rgba(255, 247, 237, 0.82)",
    // Change the supporting light text color used on dark sections.
    boneSoft: "rgba(255, 247, 237, 0.8)",
    // Change the smallest light text color used on dark sections.
    boneFaint: "rgba(255, 247, 237, 0.68)",
    // Change the border color used for subtle white borders.
    whiteBorderSoft: "rgba(255,255,255,0.3)",
  },
  metrics: {
    // Change the default asset value shown across the site.
    assetValue: "$48,000",
    // Change the default system health or uptime value.
    systemHealth: "100%",
    // Change the default sentiment index value.
    sentimentIndex: "Positive",
    // Change the default community count value.
    communityCount: "1,284",
    // Change the default review conversion rate value.
    reviewConversionRate: "24.8%",
    // Change the default active leads value for the dashboard.
    activeLeads: "1,284",
  },
  community: {
    // Change the community platform name.
    platformName: "DigitallyDefined Collective",
    // Change the community platform URL.
    platformUrl: "https://digitallydefined.online",
    // Change the default community members shown before live data syncs in.
    members: [
      {
        // Change this member name.
        name: "Rena Walker",
        // Change this member join date.
        date: "Mar 28, 2026",
        // Change this member status.
        status: "Active",
      },
      {
        // Change this member name.
        name: "Angela Brooks",
        // Change this member join date.
        date: "Mar 31, 2026",
        // Change this member status.
        status: "Onboarding",
      },
      {
        // Change this member name.
        name: "Tasha Monroe",
        // Change this member join date.
        date: "Apr 02, 2026",
        // Change this member status.
        status: "Subscribed",
      },
      {
        // Change this member name.
        name: "Nicole James",
        // Change this member join date.
        date: "Apr 04, 2026",
        // Change this member status.
        status: "Engaged",
      },
    ],
  },
  intel: {
    // Change the default campaign list shown in the dashboard.
    campaigns: [
      {
        // Change this campaign name.
        name: "Authority Launch Sequence",
        // Change this campaign conversion rate as a decimal.
        conversion: 0.248,
      },
      {
        // Change this campaign name.
        name: "Evergreen Reputation Funnel",
        // Change this campaign conversion rate as a decimal.
        conversion: 0.191,
      },
    ],
  },
  contact: {
    // Change the primary contact email.
    email: "hello@digitallydefined.online",
    // Change the primary website URL.
    website: "https://digitallydefined.online",
    // Change the Gumroad product or storefront URL.
    gumroadUrl: "https://digitallydefined.gumroad.com",
  },
  routes: {
    // Change the public landing page route.
    landing: "/",
    // Change the private dashboard route.
    dashboard: "/dashboard",
  },
  seo: {
    // Change the browser title and SEO title.
    title: "DigitallyDefined | Reputation & Revenue Engine",
    // Change the browser meta description and SEO description.
    description:
      "DigitallyDefined is an automated reputation management and digital marketing operating system for Gen X women solopreneurs, creators, and marketers.",
  },
  dashboard: {
    // Change the Google Sheets or Apps Script fallback URL.
    defaultSheetsUrl:
      "https://script.google.com/macros/s/AKfycbwEyg9UPQrxOgNVhkzGWRZAULMkjE4rCQhAKuYUoAoPEG1bCr0xU74X8dRRuyV53ARk/exec",
    // Change the navigation tabs shown in the dashboard sidebar and mobile nav.
    tabs: [
      {
        // Change this tab id if you also update the component logic.
        id: "dashboard",
        // Change this tab label.
        label: "COMMAND",
      },
      {
        // Change this tab id if you also update the component logic.
        id: "reputation",
        // Change this tab label.
        label: "REPUTATION",
      },
      {
        // Change this tab id if you also update the component logic.
        id: "intel",
        // Change this tab label.
        label: "INTEL",
      },
      {
        // Change this tab id if you also update the component logic.
        id: "brain",
        // Change this tab label.
        label: "THE BRAIN",
      },
    ],
    // Change the mobile settings button label.
    mobileKeysLabel: "Keys",
    // Change the desktop settings button label.
    systemKeysLabel: "System Keys",
    // Change the small dashboard header eyebrow prefix.
    headerEyebrowPrefix: "Proprietary OS",
    // Change the dashboard title shown on the main tab.
    dashboardTitle: "Own Your Power.",
    // Change the sync failure message.
    syncError:
      "Sync interrupted. Check the Sheets URL or Apps Script permissions.",
    // Change the message shown when a vault sync returns a non-OK response.
    syncFailurePrefix: "Vault sync failed with status",
    // Change the console label for vault errors.
    syncConsoleLabel: "Vault Connection Failed:",
    // Change the fallback last sync label when no sync has completed yet.
    lastSyncFallback: "Now",
    // Change the sync button label while syncing.
    syncingLabel: "Syncing...",
    // Change the sync button label prefix.
    lastSyncPrefix: "Last Sync:",
    // Change the section title for the community feed.
    communityFeedTitle: "Live Community Feed",
    // Change the placeholder shown before community data arrives.
    communityFeedEmpty: "Awaiting Community Sync...",
    // Change the fallback member name in the community feed.
    communityFallbackName: "Anonymous",
    // Change the fallback member date in the community feed.
    communityFallbackDate: "Recent Join",
    // Change the fallback member status in the community feed.
    communityFallbackStatus: "Stable",
    // Change the intel section title.
    intelTitle: "Strategic Intel",
    // Change the empty intel message shown before campaigns arrive.
    intelEmpty:
      "\"Your campaigns are being prepared. No excuses. Keep building.\"",
    // Change the CTA shown under the intel summary.
    intelCta: "Full Intel Briefing →",
    // Change the small conversion label shown in the intel panel.
    conversionLabel: "Conversion:",
    // Change the reputation section title.
    reputationTitle: "Reputation Triage",
    // Change the empty reputation state.
    reputationEmpty: "No reviews found in your Vault.",
    // Change the label above drafted AI responses.
    aiReplyLabel: "AI Strategic Reply:",
    // Change the placeholder when no AI response is ready.
    aiReplyPlaceholder: "Awaiting Analysis...",
    // Change the deploy response button label.
    deployReplyLabel: "Deploy Reply",
    // Change the temporary sentiment label before sentiment is known.
    analyzingLabel: "Analyzing",
    // Change the market intel section title.
    marketIntelTitle: "Market Positioning",
    // Change the fallback message when no competitor data exists.
    marketIntelEmpty: "No competitor intel logged yet.",
    // Change the reviews label shown under competitor counts.
    reviewsLabel: "Reviews",
    // Change the market share label.
    shareLabel: "Share",
    // Change the lead magnet section title.
    leadMagnetTitle: "Asset Attraction",
    // Change the fallback message when no lead magnet data exists.
    leadMagnetEmpty: "No lead magnet data synced.",
    // Change the default nurture label.
    nurtureFallback: "New",
    // Change the nurture level value treated as hottest.
    hotNurtureValue: "Hot",
    // Change the negative sentiment value.
    negativeSentimentValue: "Negative",
    // Change the generic fallback value.
    notAvailableLabel: "N/A",
    // Change the dashboard stat labels.
    stats: {
      // Change this label for asset value.
      assetValue: "Asset Value",
      // Change this label for community.
      community: "Community",
      // Change this label for system health.
      systemHealth: "System Health",
      // Change this label for sentiment.
      sentimentIndex: "Sent. Index",
    },
    // Change the title for the brain placeholder.
    brainTitle: "The Brain",
    // Change the placeholder subtitle for the brain tab.
    brainSubtitle: "Automation Logic Under Construction",
    // Change the settings modal title.
    settingsTitle: "Configuration",
    // Change the OpenRouter key input label.
    openRouterLabel: "OpenRouter AI Key",
    // Change the OpenRouter placeholder value.
    openRouterPlaceholder: "sk-...",
    // Change the save button label in the settings modal.
    saveKeysLabel: "Save System Keys",
  },
  landing: {
    // Change the nav CTA button label.
    navCta: "LAUNCH DASHBOARD →",
    // Change the hero eyebrow audience label.
    heroAudience: "BUILT FOR GEN X WOMEN",
    // Change the first hero headline line.
    heroTitleLineOne: "YOU BUILT THE SKILLS.",
    // Change the second hero headline line.
    heroTitleLineTwo: "NOW BUILD THE EMPIRE.",
    // Change the hero subheadline paragraph.
    heroSubheadline:
      "DigitallyDefined is the automated reputation and marketing OS for Gen X women solopreneurs, creators, and marketers who are ready to turn trust into traction.",
    // Change the main hero CTA label.
    heroPrimaryCta: "ACCESS THE DASHBOARD",
    // Change the secondary hero CTA label.
    heroSecondaryCta: "SEE HOW IT WORKS ↓",
    // Change the live status label for system health.
    statusSystemHealth: "SYSTEM HEALTH",
    // Change the live status label for sentiment.
    statusSentiment: "SENTIMENT",
    // Change the live status label for asset value.
    statusAssetValue: "ASSET VALUE",
    // Change the live status label for community.
    statusCommunity: "COMMUNITY",
    // Change the real talk eyebrow label.
    realTalkEyebrow: "REAL TALK",
    // Change the first real talk heading line.
    realTalkTitleLineOne: "WE WEREN'T HANDED A ROADMAP.",
    // Change the second real talk heading line.
    realTalkTitleLineTwo: "WE'RE WRITING IT NOW.",
    // Change the real talk supporting paragraph.
    realTalkBody:
      "Gen X women built careers, families, and businesses without hand-holding, endless tutorials, or a blueprint. Now we're claiming our space in the digital economy with systems that finally move at our speed.",
    // Change the real talk problem cards.
    realTalkProblems: [
      {
        // Change the icon marker shown on this card.
        icon: "01",
        // Change the problem statement.
        text: "You know your value — but your digital presence doesn't reflect it yet.",
      },
      {
        // Change the icon marker shown on this card.
        icon: "02",
        // Change the problem statement.
        text: "Reviews, DMs, and community messages are slipping through the cracks.",
      },
      {
        // Change the icon marker shown on this card.
        icon: "03",
        // Change the problem statement.
        text: "Your brand health, sentiment, and asset value live in 10 different tools.",
      },
      {
        // Change the icon marker shown on this card.
        icon: "04",
        // Change the problem statement.
        text: "You're leaving trust — and real money — on the table every single day.",
      },
    ],
    // Change the features section anchor id.
    featuresAnchor: "features",
    // Change the features eyebrow label.
    featuresEyebrow: "THE SOLUTION",
    // Change the first features heading line.
    featuresTitleLineOne: "ONE COMMAND CENTER.",
    // Change the second features heading line.
    featuresTitleLineTwo: "YOUR RULES.",
    // Change the feature cards.
    features: [
      {
        // Change the feature tag label.
        tag: "REPUTATION",
        // Change the feature card title.
        title: "Reputation Command",
        // Change the feature card description.
        description:
          "See reviews, sentiment shifts, and response drafts in one place so your trust signals never lag behind your value.",
        // Change which configured accent color this tag uses.
        tone: "primary",
      },
      {
        // Change the feature tag label.
        tag: "INTEL",
        // Change the feature card title.
        title: "Strategic Intel",
        // Change the feature card description.
        description:
          "Track campaign conversion, market positioning, and decision-ready insights without opening ten tabs before breakfast.",
        // Change which configured accent color this tag uses.
        tone: "accent",
      },
      {
        // Change the feature tag label.
        tag: "COMMUNITY",
        // Change the feature card title.
        title: "Live Community Feed",
        // Change the feature card description.
        description:
          "Watch new members, messages, and momentum in real time so no opportunity quietly slips past you.",
        // Change which configured accent color this tag uses.
        tone: "primary",
      },
      {
        // Change the feature tag label.
        tag: "THE BRAIN",
        // Change the feature card title.
        title: "The Brain (AI Layer)",
        // Change the feature card description.
        description:
          "Let the AI layer surface priorities, draft responses, and keep your operations moving even when you are off the clock.",
        // Change which configured accent color this tag uses.
        tone: "accent",
      },
      {
        // Change the feature tag label.
        tag: "COMMAND",
        // Change the feature card title.
        title: "Command Center",
        // Change the feature card description.
        description:
          "Get one place to monitor brand health, lead flow, and key business indicators with clarity instead of chaos.",
        // Change which configured accent color this tag uses.
        tone: "primary",
      },
      {
        // Change the feature tag label.
        tag: "KEYS",
        // Change the feature card title.
        title: "Keys & Integrations",
        // Change the feature card description.
        description:
          "Connect your stack, secure your access, and keep the entire engine running from one controlled environment.",
        // Change which configured accent color this tag uses.
        tone: "accent",
      },
    ],
    // Change the metrics strip labels.
    metricsStrip: {
      // Change the asset value label.
      assetValue: "Asset Value",
      // Change the system uptime label.
      systemHealth: "System Uptime",
      // Change the review conversion rate label.
      reviewConversionRate: "Review Conversion Rate",
      // Change the sentiment index label.
      sentimentIndex: "Sentiment Index",
    },
    // Change the audience eyebrow label.
    audienceEyebrow: "WHO IT'S FOR",
    // Change the first audience heading line.
    audienceTitleLineOne: "FOR THE WOMAN WHO IS",
    // Change the second audience heading line.
    audienceTitleLineTwo: "DONE WAITING.",
    // Change the audience cards.
    audienceRoles: [
      {
        // Change this audience role title.
        title: "THE SOLOPRENEUR",
        // Change this audience role description.
        description:
          "You wear every hat, so your systems need to work as hard as you do without constant babysitting.",
      },
      {
        // Change this audience role title.
        title: "THE CREATOR",
        // Change this audience role description.
        description:
          "Your visibility matters, and you need a reputation engine that protects the audience you worked to earn.",
      },
      {
        // Change this audience role title.
        title: "THE MARKETER",
        // Change this audience role description.
        description:
          "You need clean signals, sharper campaign intel, and one place to guide decisions with confidence.",
      },
      {
        // Change this audience role title.
        title: "THE COACH",
        // Change this audience role description.
        description:
          "Trust is the business model, and this system helps you measure, protect, and grow it intentionally.",
      },
      {
        // Change this audience role title.
        title: "THE REINVENTOR",
        // Change this audience role description.
        description:
          "You are building your next chapter, and your digital footprint should look like the future you are claiming.",
      },
      {
        // Change this audience role title.
        title: "THE NOMAD",
        // Change this audience role description.
        description:
          "When your work moves with you, your reputation, marketing, and community systems need to stay always on.",
      },
    ],
    // Change the how-it-works section anchor id.
    howItWorksAnchor: "how-it-works",
    // Change the how-it-works eyebrow label.
    howItWorksEyebrow: "HOW IT WORKS",
    // Change the first how-it-works heading line.
    howItWorksTitleLineOne: "THREE STEPS.",
    // Change the second how-it-works heading line.
    howItWorksTitleLineTwo: "TOTAL CLARITY.",
    // Change the step cards.
    steps: [
      {
        // Change the step number.
        number: "01",
        // Change the step title.
        title: "CONNECT YOUR STACK",
        // Change the step description.
        description:
          "Plug in your reviews, campaigns, and community channels so the system can see the full picture.",
      },
      {
        // Change the step number.
        number: "02",
        // Change the step title.
        title: "ACTIVATE YOUR AUTOMATIONS",
        // Change the step description.
        description:
          "Turn on the workflows that watch sentiment, surface priorities, and reduce the manual drag on growth.",
      },
      {
        // Change the step number.
        number: "03",
        // Change the step title.
        title: "COMMAND YOUR GROWTH",
        // Change the step description.
        description:
          "Use one command center to make sharper moves, protect your reputation, and scale with more control.",
      },
    ],
    // Change the manifesto quote.
    manifestoQuote:
      "Gen X women didn't wait for permission then. We're not waiting for it now.",
    // Change the manifesto attribution.
    manifestoAttribution: "— DigitallyDefined",
    // Change the final CTA eyebrow label.
    finalCtaEyebrow: "YOUR MOVE",
    // Change the final CTA heading.
    finalCtaTitle:
      "STOP MANAGING BY GUT. START COMMANDING WITH DATA.",
    // Change the final CTA paragraph.
    finalCtaBody:
      "The dashboard shows what is happening. The system helps decide what to do next. That is the difference between reacting and building an empire.",
    // Change the final CTA button label.
    finalCtaButton: "ACCESS THE DASHBOARD →",
    // Change the separator used in meta lines.
    metaSeparator: " / ",
    // Change the final CTA small print suffix.
    finalCtaSmallPrintSuffix: "ALWAYS ON · ALWAYS WORKING",
    // Change the footer dashboard link label.
    footerDashboard: "Dashboard",
    // Change the footer features link label.
    footerFeatures: "Features",
    // Change the footer contact link label.
    footerContact: "Contact",
    // Change the copyright suffix text.
    footerRights: "All rights reserved.",
    // Change the copyright prefix text.
    footerCopyrightPrefix: "(c)",
  },
};

export default CONFIG;
