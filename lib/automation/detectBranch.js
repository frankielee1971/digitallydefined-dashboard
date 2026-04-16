export function detectBranch(body) {
  if (body["Review Text"] || body.review_text) return "review";
  if (body["Member name"] || body.member_name) return "community";
  if (body.landing_page || body.asset_downloaded || body.nurture_level) return "lead";
  return "lead"; // default for your current waitlist form
}
