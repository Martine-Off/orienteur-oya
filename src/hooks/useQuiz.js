import { useState } from "react";
import { QUESTIONS } from "../data/questions";
import { isAnswered } from "../utils/validation";

/**
 * State du quiz : index de la question courante + réponses accumulées.
 * Validation côté client uniquement (pas d'appel serveur avant le submit final).
 */
export function useQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reponses, setReponses] = useState({});

  const question = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const isFirst = currentIndex === 0;

  function setReponse(questionId, value) {
    setReponses((prev) => ({ ...prev, [questionId]: value }));
  }

  function canGoNext() {
    return isAnswered(reponses[question.id]);
  }

  function goNext() {
    if (!canGoNext() || isLast) return false;
    setCurrentIndex((i) => i + 1);
    return true;
  }

  function goPrevious() {
    if (isFirst) return false;
    setCurrentIndex((i) => i - 1);
    return true;
  }

  return {
    question,
    currentIndex,
    total: QUESTIONS.length,
    isLast,
    isFirst,
    reponses,
    setReponse,
    canGoNext,
    goNext,
    goPrevious,
  };
}
