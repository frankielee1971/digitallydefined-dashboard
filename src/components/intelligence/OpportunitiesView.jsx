export default function OpportunitiesView({ opportunities }) {
  return (
    <div className="card">
      <h2>Opportunity Scan</h2>

      <h3>Gaps</h3>
      <ul>
        {opportunities.gaps.map((g, i) => (
          <li key={i}>{g}</li>
        ))}
      </ul>

      <h3>Underserved Audiences</h3>
      <ul>
        {opportunities.underservedAudiences.map((u, i) => (
          <li key={i}>{u}</li>
        ))}
      </ul>

      <h3>Unmet Needs</h3>
      <ul>
        {opportunities.unmetNeeds.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      <h3>Recommended Opportunities</h3>
      <ul>
        {opportunities.recommendedOpportunities.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ul>
    </div>
  );
}
