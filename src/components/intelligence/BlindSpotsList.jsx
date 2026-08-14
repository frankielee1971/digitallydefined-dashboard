export default function BlindspotsList({ blindspots }) {
  return (
    <div className="card">
      <h3>Blindspots</h3>
      <ul>
        {blindspots.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
