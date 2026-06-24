import { useState } from "react";
import { isValidEmail } from "../utils/validation";

export default function EmailCaptureForm({ onSubmit, submitting, submitLabel = "Envoyer" }) {
  const [email, setEmail] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [etreTenuAuCourant, setEtreTenuAuCourant] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid = isValidEmail(email);
  // RGPD requis (art. 7 RGPD) : le bouton est désactivé tant que le consentement
  // n'est pas coché. Double protection : le handleSubmit vérifie aussi canSubmit.
  const canSubmit = emailValid && rgpd && !submitting;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({ email: email.trim(), rgpd, etreTenuAuCourant });
  }

  return (
    <form className="email-capture-form" onSubmit={handleSubmit} noValidate>
      <h2>Recevoir mon diagnostic par email</h2>

      <label htmlFor="email">
        Email <span aria-hidden="true">*</span>
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={touched && !emailValid}
        aria-describedby="email-error"
      />
      {touched && !emailValid && (
        <p id="email-error" className="field-error" role="alert">
          Format email incorrect (ex&nbsp;: user@example.com)
        </p>
      )}

      <label className="checkbox-label" htmlFor="etre-tenu-au-courant">
        <input
          id="etre-tenu-au-courant"
          type="checkbox"
          checked={etreTenuAuCourant}
          onChange={(e) => setEtreTenuAuCourant(e.target.checked)}
        />
        Être tenu·e au courant des formations OYA
      </label>

      <label className="checkbox-label" htmlFor="rgpd">
        <input
          id="rgpd"
          type="checkbox"
          required
          checked={rgpd}
          onChange={(e) => setRgpd(e.target.checked)}
          aria-describedby="rgpd-error"
        />
        J'accepte de recevoir mon diagnostic par email et que mes données soient utilisées par OYA.{" "}
        <span style={{ color: "#A85D08", textDecoration: "underline", cursor: "default", fontSize: "0.85rem" }}>
          Politique de confidentialité
        </span>{" "}
        <span aria-hidden="true">*</span>
      </label>
      {touched && !rgpd && (
        <p id="rgpd-error" className="field-error" role="alert">
          Vous devez accepter pour continuer.
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
        {submitting ? "Chargement…" : submitLabel}
      </button>
    </form>
  );
}
