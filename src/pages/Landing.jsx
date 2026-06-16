import { Link } from "react-router-dom";
import logo from "../assets/logo_oya.svg";

export default function Landing() {
  return (
    <main className="page page-landing">
      <img src={logo} alt="Logo OYA" className="landing-logo" width="160" height="100" />
      <h1>L'Orienteur OYA</h1>
      <p className="landing-pitch">
        OYA forme aux métiers de la transition alimentaire : agriculture, transformation,
        distribution, restauration. Répondez à quelques questions pour découvrir les 3 métiers
        qui correspondent le mieux à votre profil et vos envies.
      </p>
      <ul className="landing-points">
        <li>9 questions, moins de 5 minutes</li>
        <li>Un diagnostic personnalisé avec vos 3 métiers les mieux assortis</li>
        <li>Reçu par email, gratuitement</li>
      </ul>
      <Link to="/quiz" className="btn btn-primary">
        Démarrer le quiz
      </Link>
    </main>
  );
}
