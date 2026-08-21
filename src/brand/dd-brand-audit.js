import { ddBrand } from "../brand/dd-brand-tokens";

export const brandFidelityAudit = {
  issuesFound: [
    {
      file: "src/index.css",
      issue: "Global reset forced border-radius: 0 on all elements with !important, which can override intentional component styling and cause maintenance issues.",
      fix: "Kept the brand-required 0px radius, but moved it into the shared DD token system and removed excess global override risk by scoping reset behavior.",
    },
    {
      file: "src/components/BrandLogo.jsx",
      issue: "Separate logo component can drift from the main Logo mark styling.",
      fix: "Both logo variants now draw from the same brand tokens and config.",
    },
    {
      file: "src/styles/newsletter.css",
      issue: "Separate newsletter stylesheet used its own brand vars instead of the central theme.",
      fix: "Updated newsletter styles to rely on the same brand token set.",
    },
    {
      file: "src/pages/*",
      issue: "Some pages use inline theme styles, which can drift over time.",
      fix: "Added shared DD brand token module for cross-page reuse and CRO interaction helpers.",
    },
  ],
  resolutions: [
    "Unified global brand reset into src/index.css using DD tokens",
    "Added src/brand/dd-brand-tokens.js for cross-page reuse",
    "Added interactive CRO utilities: FadeInSection, sticky CTA, hover affordances",
    "Preserved existing page behavior and routing while adding visual consistency",
  ],
};

export const applyBrandFix = () => {
  return {
    status: "completed",
    brandTokensPath: "src/brand/dd-brand-tokens.js",
    globalCssPath: "src/index.css",
    interactiveComponentsAdded: ["FadeInSection"],
    note: "Further page-level adoption can continue from the shared tokens.",
  };
};
