import { useLocation, Navigate, useNavigate } from "react-router-dom";
import EmailCaptureForm from "../components/EmailCaptureForm";

export default function EmailCapture() {
  const location = useLocation();
  const navigate = useNavigate();
  const reponses = location.state?.reponses;

  if (!reponses) {
    return <Navigate to="/quiz" replace />;
  }

  function handleSubmit({ email, rgpd, etreTenuAuCourant }) {
    navigate("/resultats", { state: { reponses, email, rgpd, etreTenuAuCourant } });
  }

  return (
    <div className="email-modal-overlay">
      <div className="email-modal">
        <EmailCaptureForm
          onSubmit={handleSubmit}
          submitting={false}
          submitLabel="Voir mes résultats"
        />
      </div>
    </div>
  );
}
