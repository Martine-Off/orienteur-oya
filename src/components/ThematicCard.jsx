const NIVEAU_LABELS = {
  3: "CAP",
  4: "Bac",
  5: "BTS / BTSA",
  6: "Licence",
  7: "Master et plus",
};

export default function ThematicCard({ thematique, avgScore, metiers, isTop }) {
  return (
    <article className={`thematic-card${isTop ? " thematic-card--top" : ""}`}>
      <div className="thematic-card__header">
        {isTop && (
          <span className="thematic-card__top-badge">Meilleure correspondance</span>
        )}
        <h2 className="thematic-card__title">{thematique}</h2>
        <span
          className="thematic-card__avg-score"
          aria-label={`Score moyen de compatibilité : ${avgScore} sur 100`}
        >
          Score moyen {avgScore}/100
        </span>
      </div>

      <div className="thematic-card__metiers">
        {metiers.map(({ metier, score }, i) => (
          <div key={metier.id} className="thematic-card__metier">
            <div className="thematic-card__metier-header">
              <span className="thematic-card__metier-rang">#{i + 1}</span>
              <strong className="thematic-card__metier-nom">{metier.metier}</strong>
              <span
                className="thematic-card__metier-score"
                aria-label={`Score : ${score} sur 100`}
              >
                {score}/100
              </span>
            </div>

            <div className="thematic-card__metier-meta">
              <span className="metier-card-meta-label">Niveau</span>
              <strong>{NIVEAU_LABELS[metier.niveauMin] || metier.niveauMin}</strong>
              {metier.statut && (
                <span
                  className={`metier-card-statut metier-card-statut--${metier.statut.toLowerCase()}`}
                >
                  {metier.statut}
                </span>
              )}
            </div>

            {metier.competencesCles?.length > 0 && (
              <ul className="thematic-card__competences">
                {metier.competencesCles.slice(0, 3).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
