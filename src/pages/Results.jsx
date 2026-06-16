import { useLocation, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { useMetiers } from "../hooks/useMetiers";
import { getTopMetiers } from "../utils/scoring";
import MetierCard from "../components/MetierCard";
import EmailCaptureForm from "../components/EmailCaptureForm";
import { submitLead } from "../utils/api";

export default function Results() {
  const location = useLocation();
  const reponses = location.state?.reponses;
  const { metiers, loading, error } = useMetiers();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | done | error

  if (!reponses) {
    return <Navigate to="/quiz" replace />;
  }

  if (loading) {
    return (
      <main className="page page-results">
        <p>Calcul de votre diagnostic en cours...</p>
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

  const top3 = getTopMetiers(reponses, metiers, 3);

  async function handleEmailSubmit({ email, rgpd, etreTenuAuCourant }) {
    setSubmitState("submitting");
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
        Q9_region: reponses.Q9,
        top_3_métiers: top3.map((t) => t.metier.metier),
        scores: top3.map((t) => t.score),
        région: reponses.Q9,
        bloc: top3[0]?.metier.bloc,
        être_tenu_au_courant: etreTenuAuCourant,
        rgpd_accepte: rgpd,
      });
      setSubmitState("done");
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "done") {
    return (
      <main className="page page-results">
        <h1>Merci !</h1>
        <p>Votre diagnostic a été envoyé. Vérifiez votre boîte mail dans les prochaines minutes.</p>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="page page-results">
      <h1>Votre top 3 métiers</h1>
      <div className="metier-cards">
        {top3.map(({ metier, score }, i) => (
          <MetierCard key={metier.id} rang={i + 1} metier={metier} score={score} />
        ))}
      </div>

      {!showEmailForm && (
        <button type="button" className="btn btn-primary" onClick={() => setShowEmailForm(true)}>
          Recevoir mon diagnostic par email
        </button>
      )}

      {showEmailForm && (
        <EmailCaptureForm onSubmit={handleEmailSubmit} submitting={submitState === "submitting"} />
      )}

      {submitState === "error" && (
        <p role="alert" className="field-error">
          L'envoi a échoué. Vérifiez votre connexion et réessayez.
        </p>
      )}
    </main>
  );
}
