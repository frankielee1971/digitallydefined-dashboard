export default function TrendsView({ trends }) {
  return (
    <div className="card">
      <h2>Trend Analysis</h2>

      <h3>Rising Topics</h3>
      <ul>
        {trends.risingTopics.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      <h3>Platform Trends</h3>
      <ul>
        {trends.platformTrends.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      <h3>Search Momentum</h3>
      <p>Last 30 Days: {trends.searchMomentum.last30Days}</p>
      <p>Last 90 Days: {trends.searchMomentum.last90Days}</p>
      <p>Prediction: {trends.searchMomentum.prediction}</p>
    </div>
  );
}
