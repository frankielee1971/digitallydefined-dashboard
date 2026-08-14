export default function RoadmapView({ roadmap }) {
  return (
    <div className="card">
      <h2>Your Roadmap</h2>

      {roadmap.map((phase, i) => (
        <div key={i} className="roadmap-phase">
          <h3>{phase.phase}</h3>
          <p>{phase.description}</p>

          <ul>
            {phase.actions.map((action, j) => (
              <li key={j}>{action}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
