import { useLocation, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { useMetiers } from "../hooks/useMetiers";
import { groupByThematique } from "../utils/scoring";
import ThematicCard from "../components/ThematicCard";
import EmailCaptureForm from "../components/EmailCaptureForm";
import { submitLead } from "../utils/api";

function SuccessMessage({ email }) {
  return (
    <main className="page page-results page-confirmation">
      <div className="success-icon" aria-hidden="true">
        <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="success-circle" cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2.5" />
          <path className="success-check" d="M14 27l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1>Merci&nbsp;!</h1>
      <p>
        Votre diagnostic a été envoyé à <strong>{email}</strong>.
        <br />
        Vérifiez votre boîte mail dans les prochaines minutes.
      </p>
      <div className="confirmation-actions">
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
        <Link to="/quiz" className="btn btn-secondary">
          Refaire le quiz
        </Link>
      </div>
    </main>
  );
}

export default function Results() {
  const location = useLocation();
  const reponses = location.state?.reponses;
  const { metiers, loading, error } = useMetiers();
  const [showEmailForm, setShowEmailForm] = useState(false);
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

  async function handleEmailSubmit({ email, rgpd, etreTenuAuCourant }) {
    setSubmitState("submitting");
    const peursTexte = Object.entries(reponses.Q9 || {})
      .filter(([, v]) => v === true)
      .map(([k]) => k)
      .join(", ");
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
        // Backward compat avec le Sheet : meilleur métier de chaque thématique
        top_3_métiers: thematiques.map((t) => t.metiers[0]?.metier.metier),
        scores: thematiques.map((t) => t.metiers[0]?.score),
        région: reponses.Q10,
        bloc: thematiques[0]?.thematique,
        être_tenu_au_courant: etreTenuAuCourant,
        rgpd_accepte: rgpd,
      });
      setConfirmedEmail(email);
      setSubmitState("done");
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "done") {
    return <SuccessMessage email={confirmedEmail} />;
  }

  return (
    <main className="page page-results">
      <h1>Vos thématiques de reconversion</h1>

      <div className="thematic-list">
        {thematiques.map((t, i) => (
          <ThematicCard
            key={t.thematique}
            thematique={t.thematique}
            avgScore={t.avgScore}
            metiers={t.metiers}
            isTop={i === 0}
          />
        ))}
      </div>

      {!showEmailForm && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowEmailForm(true)}
        >
          Recevoir mon diagnostic par email
        </button>
      )}

      {showEmailForm && (
        <div className="email-form-reveal">
          <EmailCaptureForm
            onSubmit={handleEmailSubmit}
            submitting={submitState === "submitting"}
          />
        </div>
      )}

      {submitState === "error" && (
        <p role="alert" className="field-error">
          Erreur lors de l'envoi. Vérifiez votre connexion et réessayez.
        </p>
      )}
    </main>
  );
}
