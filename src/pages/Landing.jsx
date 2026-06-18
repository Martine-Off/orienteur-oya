import { Link } from "react-router-dom";
import logo from "../assets/logo_oya.svg";

export default function Landing() {
  return (
    <main className="page page-landing">
      <img
        src="/images/Image2campagne.jpg"
        alt="Paysage agricole"
        className="landing-hero"
      />
      <img src={logo} alt="Logo OYA" className="landing-logo" width="160" height="100" />
      <h1>L'Orienteur OYA</h1>
      <p className="landing-pitch">
        Découvrez votre orientation métier en 5&nbsp;min.
      </p>
      <div className="landing-stats" aria-hidden="true">
        <div className="landing-stat">
          <strong>5 min</strong>
          <span>de diagnostic</span>
        </div>
        <div className="landing-stat">
          <strong>76 métiers</strong>
          <span>analysés</span>
        </div>
        <div className="landing-stat">
          <strong>Gratuit</strong>
          <span>sans compte</span>
        </div>
      </div>
      <Link to="/quiz" className="btn btn-primary landing-cta">
        Démarrer le diagnostic
      </Link>
    </main>
  );
}
