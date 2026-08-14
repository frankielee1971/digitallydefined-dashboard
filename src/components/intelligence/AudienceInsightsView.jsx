export default function AudienceInsightsView({ audience }) {
  return (
    <div className="card">
      <h2>Audience Insights</h2>

      <h3>Pain Points</h3>
      <ul>
        {audience.painPoints.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <h3>Desires</h3>
      <ul>
        {audience.desires.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>

      <h3>Motivations</h3>
      <ul>
        {audience.motivations.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>

      <h3>Buying Triggers</h3>
      <ul>
        {audience.buyingTriggers.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
