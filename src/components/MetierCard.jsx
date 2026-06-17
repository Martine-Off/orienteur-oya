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

      {metier.thematiqueFormation && (
        <p className="metier-card-description">{metier.thematiqueFormation}</p>
      )}

      <div className="metier-card-meta">
        <span className="metier-card-meta-item">
          <span className="metier-card-meta-label">Niveau</span>
          <strong>{NIVEAU_LABELS[metier.niveauMin] || metier.niveauMin}</strong>
        </span>
        {metier.statut && (
          <span className={`metier-card-statut metier-card-statut--${metier.statut.toLowerCase()}`}>
            {metier.statut}
          </span>
        )}
      </div>

      {metier.formationsPrioritaires && (
        <p className="metier-card-formation">
          <span className="metier-card-meta-label">Formation</span>{" "}
          {metier.formationsPrioritaires}
        </p>
      )}

      {metier.competencesCles?.length > 0 && (
        <ul className="metier-card-competences">
          {metier.competencesCles.slice(0, 3).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
