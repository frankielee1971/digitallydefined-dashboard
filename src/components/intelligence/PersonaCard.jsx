export default function PersonaCard({ persona }) {
  return (
    <div className="card">
      <h2>Your Persona</h2>
      <p>{persona}</p>
    </div>
  );
}
