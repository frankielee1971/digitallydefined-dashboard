export default function StrengthsList({ strengths }) {
  return (
    <div className="card">
      <h3>Core Strengths</h3>
      <ul>
        {strengths.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
