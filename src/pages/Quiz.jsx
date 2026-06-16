import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuiz } from "../hooks/useQuiz";
import Question from "../components/Question";
import ProgressBar from "../components/ProgressBar";

export default function Quiz() {
  const navigate = useNavigate();
  const [confirmQuit, setConfirmQuit] = useState(false);
  const {
    question,
    currentIndex,
    total,
    isLast,
    isFirst,
    reponses,
    setReponse,
    canGoNext,
    goNext,
    goPrevious,
  } = useQuiz();

  function handleSubmit(e) {
    e.preventDefault();
    if (isLast) {
      navigate("/resultats", { state: { reponses } });
    } else {
      goNext();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setConfirmQuit(true);
    }
  }

  return (
    <main className="page page-quiz" onKeyDown={handleKeyDown}>
      <ProgressBar current={currentIndex + 1} total={total} />
      <form onSubmit={handleSubmit}>
        <Question
          question={question}
          value={reponses[question.id]}
          onChange={(value) => setReponse(question.id, value)}
        />
        <div className="quiz-actions">
          <button type="button" onClick={goPrevious} disabled={isFirst} className="btn btn-secondary">
            Précédent
          </button>
          <button type="submit" disabled={!canGoNext()} className="btn btn-primary">
            {isLast ? "Voir mes résultats" : "Suivant"}
          </button>
        </div>
      </form>

      {confirmQuit && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Quitter le quiz">
          <div className="modal">
            <p>Voulez-vous vraiment quitter le quiz ? Vos réponses seront perdues.</p>
            <div className="quiz-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmQuit(false)}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
