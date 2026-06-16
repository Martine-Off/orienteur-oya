const NIVEAU_LABELS = {
  3: "CAP",
  4: "Bac",
  5: "BTS / BTSA",
  6: "Licence",
  7: "Master et plus",
};

export default function MetierCard({ rang, metier, score }) {
  return (
    <article className="metier-card">
      <div className="metier-card-header">
        <span className="metier-card-rang">#{rang}</span>
        <span className="metier-card-score" aria-label={`Score de compatibilité : ${score} sur 100`}>
          {score}/100
        </span>
      </div>
      <h3>{metier.metier}</h3>
      <p className="metier-card-bloc">{metier.bloc}</p>
      <p className="metier-card-niveau">
        Niveau de qualification : <strong>{NIVEAU_LABELS[metier.niveauMin] || metier.niveauMin}</strong>
      </p>
      {metier.competencesCles?.length > 0 && (
        <ul className="metier-card-competences">
          {metier.competencesCles.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
