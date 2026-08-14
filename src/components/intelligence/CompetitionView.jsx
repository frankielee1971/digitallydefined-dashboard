export default function CompetitionView({ competition }) {
  return (
    <div className="card">
      <h2>Competition Analysis</h2>

      {competition.topCompetitors.map((c, i) => (
        <div key={i} className="competitor">
          <h3>{c.name}</h3>

          <strong>Strengths</strong>
          <ul>
            {c.strengths.map((s, j) => (
              <li key={j}>{s}</li>
            ))}
          </ul>

          <strong>Weaknesses</strong>
          <ul>
            {c.weaknesses.map((w, j) => (
              <li key={j}>{w}</li>
            ))}
          </ul>
        </div>
      ))}

      <h3>Positioning Insights</h3>
      <ul>
        {competition.positioningInsights.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <h3>Recommended Actions</h3>
      <ul>
        {competition.recommendedActions.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}
