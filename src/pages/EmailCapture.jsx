import { useLocation, Navigate, Link } from "react-router-dom";
import { useState } from "react";
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
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        <Link to="/quiz" className="btn btn-secondary">Refaire le quiz</Link>
      </div>
    </main>
  );
}

export default function EmailCapture() {
  const location = useLocation();
  const reponses = location.state?.reponses;
  const thematiques = location.state?.thematiques;
  const [submitState, setSubmitState] = useState("idle");
  const [confirmedEmail, setConfirmedEmail] = useState("");

  if (!reponses || !thematiques) {
    return <Navigate to="/quiz" replace />;
  }

  async function handleSubmit({ email, rgpd, etreTenuAuCourant }) {
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
        thematique_1: thematiques[0]?.thematique || "",
        metier_1: thematiques[0]?.metiers[0]?.metier.metier || "",
        score_1: thematiques[0]?.avgScore ?? "",
        thematique_2: thematiques[1]?.thematique || "",
        metier_2: thematiques[1]?.metiers[0]?.metier.metier || "",
        score_2: thematiques[1]?.avgScore ?? "",
        thematique_3: thematiques[2]?.thematique || "",
        metier_3: thematiques[2]?.metiers[0]?.metier.metier || "",
        score_3: thematiques[2]?.avgScore ?? "",
        etre_tenu_au_courant: etreTenuAuCourant,
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
    <main className="page page-email-capture">
      <EmailCaptureForm
        onSubmit={handleSubmit}
        submitting={submitState === "submitting"}
      />
      {submitState === "error" && (
        <p role="alert" className="field-error">
          Erreur lors de l'envoi. Vérifiez votre connexion et réessayez.
        </p>
      )}
    </main>
  );
}
