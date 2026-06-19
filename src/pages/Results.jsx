import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useMetiers } from "../hooks/useMetiers";
import { groupByThematique, normalizeAnswers, NIVEAU_ETUDES } from "../utils/scoring";
import { submitLead } from "../utils/api";
import { isValidEmail } from "../utils/validation";
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

function ResultCard({ thematique, rank, rankLabel, normalizedScores }) {
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
              <RadarChartMetier metier={metier} normalizedScores={normalizedScores} />
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

function EmailModal({ onSubmit, onClose, submitting, hasError }) {
  const [email, setEmail] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [touched, setTouched] = useState(false);
  const emailValid = isValidEmail(email);
  const buttonEnabled = emailValid && rgpd && !submitting;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!emailValid || !rgpd || submitting) return;
    onSubmit({ email: email.trim(), rgpd, etreTenuAuCourant: optIn });
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleOverlayKeyDown(e) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="email-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
    >
      <div className="email-modal">
        <button
          type="button"
          className="email-modal__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <h2 id="email-modal-title">Recevoir mon diagnostic</h2>

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label htmlFor="modal-email" style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "6px" }}>
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="modal-email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={touched && !emailValid}
              aria-describedby={touched && !emailValid ? "modal-email-error" : undefined}
            />
            {touched && !emailValid && (
              <p id="modal-email-error" className="field-error" role="alert" style={{ marginTop: 4 }}>
                Format email incorrect (ex&nbsp;: user@example.com)
              </p>
            )}
          </div>

          <label className="checkbox-label" htmlFor="modal-opt-in">
            <input
              id="modal-opt-in"
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
            />
            Être tenu·e au courant des formations OYA
          </label>

          <label className="checkbox-label" htmlFor="modal-rgpd">
            <input
              id="modal-rgpd"
              type="checkbox"
              required
              checked={rgpd}
              onChange={(e) => setRgpd(e.target.checked)}
              aria-describedby={touched && !rgpd ? "modal-rgpd-error" : undefined}
            />
            J'accepte de recevoir mon diagnostic par email et que mes données soient utilisées par OYA.{" "}
            <span style={{ color: "#A85D08", textDecoration: "underline", cursor: "default", fontSize: "0.85rem" }}>
              Politique de confidentialité
            </span>{" "}
            <span aria-hidden="true">*</span>
          </label>
          {touched && !rgpd && (
            <p id="modal-rgpd-error" className="field-error" role="alert">
              Vous devez accepter pour continuer.
            </p>
          )}

          {hasError && (
            <p className="field-error" role="alert">
              Erreur lors de l'envoi. Vérifiez votre connexion et réessayez.
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={!buttonEnabled}>
            {submitting ? "Envoi en cours…" : "Envoyer mon diagnostic"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Results() {
  const location = useLocation();
  const reponses = location.state?.reponses;
  const { metiers, loading, error } = useMetiers();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [confirmedEmail, setConfirmedEmail] = useState("");

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

  async function handleEmailSubmit({ email, rgpd, etreTenuAuCourant }) {
    setSubmitState("submitting");
    const peursTexte = peursChoisies.map((p) => p.label).join(", ");
    try {
      await submitLead({
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
        top_3_thematiques: thematiques.map((t) => t.thematique),
        scores_thematiques: thematiques.map((t) => t.avgScore),
        top_3_métiers: thematiques.map((t) => t.metiers[0]?.metier.metier),
        scores: thematiques.map((t) => t.metiers[0]?.score),
        metiers_2: thematiques.map((t) => t.metiers[1]?.metier.metier),
        scores_2: thematiques.map((t) => t.metiers[1]?.score),
        metiers_3: thematiques.map((t) => t.metiers[2]?.metier.metier),
        scores_3: thematiques.map((t) => t.metiers[2]?.score),
        région: reponses.Q10,
        bloc: thematiques[0]?.thematique,
        être_tenu_au_courant: etreTenuAuCourant,
        rgpd_accepte: rgpd,
      });
      setConfirmedEmail(email);
      setSubmitState("done");
      setShowModal(false);
    } catch {
      setSubmitState("error");
    }
  }

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
          />
        ))}
      </div>

      <ProfilRecap reponses={reponses} />

      {submitState === "done" ? (
        <p className="results-success" role="status">
          Diagnostic envoyé à {confirmedEmail} — vérifiez votre boîte mail.
        </p>
      ) : (
        <button
          type="button"
          className="btn btn-primary results-cta"
          onClick={() => setShowModal(true)}
        >
          Recevoir mon diagnostic par email
        </button>
      )}

      <button
        type="button"
        className="btn btn-secondary results-retry"
        onClick={() => navigate("/")}
      >
        Refaire le test
      </button>

      {showModal && (
        <EmailModal
          onSubmit={handleEmailSubmit}
          onClose={() => { setShowModal(false); setSubmitState("idle"); }}
          submitting={submitState === "submitting"}
          hasError={submitState === "error"}
        />
      )}
    </main>
  );
}
