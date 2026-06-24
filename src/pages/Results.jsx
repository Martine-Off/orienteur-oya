import { useState, useEffect, useRef } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useMetiers } from "../hooks/useMetiers";
import { groupByThematique, normalizeAnswers, NIVEAU_ETUDES } from "../utils/scoring";
import { submitLead } from "../utils/api";
import { PEURS } from "../data/questions";
import RadarChartMetier from "../components/RadarChartMetier";

const BAR_COLORS = {
  1: "var(--bar-rank-1, #EF8D11)",
  2: "var(--bar-rank-2, #38AA3F)",
  3: "var(--bar-rank-3, #E8D4C8)",
};

const RANK_LABELS = [
  "Meilleure correspondance",
  "Bonne correspondance",
  "À explorer",
];

function ScoreBar({ score, rank }) {
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${score}%`, background: BAR_COLORS[rank] || BAR_COLORS[3] }}
        />
      </div>
      <span className="score-bar-pct">{score}%</span>
    </div>
  );
}

function ResultCard({ thematique, rank, rankLabel, normalizedScores, reponses }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`result-card result-card--rank${rank}`}>
      <div className="result-card__header">
        <span className="result-card__rank-badge">{rankLabel}</span>
        <h2 className="result-card__title">{thematique.thematique}</h2>
        <ScoreBar score={thematique.avgScore} rank={rank} />
      </div>

      <ul className="result-card__metiers">
        {thematique.metiers.map(({ metier, score }) => (
          <li key={metier.id} className="result-card__metier-item">
            <span className="result-card__metier-nom">{metier.metier}</span>
            <span className="result-card__metier-score">{score}/100</span>
          </li>
        ))}
      </ul>

      {!expanded && (
        <button
          type="button"
          className="result-card__details-btn"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
        >
          Voir les détails
        </button>
      )}

      {expanded && (
        <div className="result-card__details">
          {thematique.metiers.map(({ metier }) => (
            <div key={metier.id} className="result-card__detail-item">
              <strong>{metier.metier}</strong>
              {metier.statut && (
                <span>Statut : {metier.statut}</span>
              )}
              {metier.competencesCles?.length > 0 && (
                <ul>
                  {metier.competencesCles.slice(0, 3).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
              <RadarChartMetier metier={metier} normalizedScores={normalizedScores} reponses={reponses} />
            </div>
          ))}
          <button
            type="button"
            className="result-card__details-btn result-card__details-btn--close"
            onClick={() => setExpanded(false)}
            aria-expanded={true}
          >
            Masquer les détails
          </button>
        </div>
      )}
    </article>
  );
}

function ProfilRecap({ reponses }) {
  const niveauLabel = NIVEAU_ETUDES.find((e) => e.value === Number(reponses.Q2))?.label;
  const peursChoisies = PEURS.filter((p) => reponses.Q9?.[p.key]);

  const lignes = [
    { label: "Secteur d'origine",     valeur: reponses.Q1 },
    { label: "Niveau d'études",        valeur: niveauLabel },
    { label: "Cadre de vie",           valeur: reponses.Q3 },
    { label: "Ce qui vous attire",     valeur: reponses.Q4 },
    { label: "Contraintes physiques",  valeur: reponses.Q5 },
    { label: "Temps disponible",       valeur: reponses.Q6 },
    { label: "Budget reconversion",    valeur: reponses.Q7 },
    { label: "Expérience agriculture", valeur: reponses.Q8 },
    { label: "Région",                 valeur: reponses.Q10 },
  ].filter((l) => l.valeur);

  return (
    <div className="profil-recap">
      <h2>Votre profil</h2>
      <dl className="profil-recap__grid">
        {lignes.map(({ label, valeur }) => (
          <div key={label} className="profil-recap__item">
            <dt>{label}</dt>
            <dd>{valeur}</dd>
          </div>
        ))}
      </dl>
      {peursChoisies.length > 0 && (
        <div className="profil-recap__peurs">
          <p className="profil-recap__peurs-titre">Préoccupations identifiées</p>
          <ul className="peurs-list">
            {peursChoisies.map((p) => <li key={p.key}>{p.label}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}


export default function Results() {
  const location = useLocation();
  const reponses = location.state?.reponses;
  const email = location.state?.email;
  const rgpd = location.state?.rgpd;
  const etreTenuAuCourant = location.state?.etreTenuAuCourant;
  const { metiers, loading, error } = useMetiers();
  const navigate = useNavigate();
  const [submitState, setSubmitState] = useState("idle");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const sendRef = useRef(false);

  useEffect(() => {
    if (loading || error || !metiers || !email || !rgpd || sendRef.current) return;
    sendRef.current = true;
    const th = groupByThematique(reponses, metiers, 3);
    const pc = PEURS.filter((p) => reponses.Q9?.[p.key]);
    const peursTexte = pc.map((p) => p.label).join(", ");
    setSubmitState("submitting");
    submitLead({
      email,
      Q1: reponses.Q1,
      Q2: reponses.Q2,
      Q3: reponses.Q3,
      Q4: reponses.Q4,
      Q5: reponses.Q5,
      Q6: reponses.Q6,
      Q7: reponses.Q7,
      Q8: reponses.Q8,
      Q9_peurs: peursTexte,
      Q10_region: reponses.Q10,
      top_3_thematiques: th.map((t) => t.thematique),
      scores_thematiques: th.map((t) => t.avgScore),
      top_3_metiers: th.map((t) => t.metiers[0]?.metier.metier),
      scores: th.map((t) => t.metiers[0]?.score),
      metiers_2: th.map((t) => t.metiers[1]?.metier.metier),
      scores_2: th.map((t) => t.metiers[1]?.score),
      metiers_3: th.map((t) => t.metiers[2]?.metier.metier),
      scores_3: th.map((t) => t.metiers[2]?.score),
      région: reponses.Q10,
      bloc: th[0]?.thematique,
      etre_tenu_au_courant: etreTenuAuCourant,
      rgpd_accepte: rgpd,
    })
      .then(() => { setConfirmedEmail(email); setSubmitState("done"); })
      .catch(() => setSubmitState("error"));
  }, [loading, error, metiers]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!reponses) {
    return <Navigate to="/quiz" replace />;
  }

  if (loading) {
    return (
      <main className="page page-results">
        <p>Calcul de votre diagnostic en cours…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page page-results">
        <p role="alert">Impossible de charger les métiers ({error}). Réessayez plus tard.</p>
      </main>
    );
  }

  const thematiques = groupByThematique(reponses, metiers, 3);
  const peursChoisies = PEURS.filter((p) => reponses.Q9?.[p.key]);
  const normalizedScores = normalizeAnswers(reponses);

  return (
    <main className="page page-results">
      <div className="results-header">
        <div className="results-progress">
          <div className="results-progress-fill" />
        </div>
        <h1>Votre diagnostic personnalisé</h1>
      </div>

      <div className="results-grid">
        {thematiques.map((t, i) => (
          <ResultCard
            key={t.thematique}
            thematique={t}
            rank={i + 1}
            rankLabel={RANK_LABELS[i] ?? `Rang ${i + 1}`}
            normalizedScores={normalizedScores}
            reponses={reponses}
          />
        ))}
      </div>

      <ProfilRecap reponses={reponses} />

      {email && (
        <p className="results-email-status" role="status">
          {submitState === "submitting" && "Envoi de votre diagnostic en cours…"}
          {submitState === "done" && `Diagnostic envoyé à ${confirmedEmail} — vérifiez votre boîte mail.`}
          {submitState === "error" && "Erreur lors de l'envoi. Vérifiez votre connexion et réessayez."}
        </p>
      )}

      <button
        type="button"
        className="btn btn-secondary results-retry"
        onClick={() => navigate("/")}
      >
        Refaire le test
      </button>
    </main>
  );
}
