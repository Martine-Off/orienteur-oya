import {
  NIVEAU_ETUDES,
  SECTEURS_ORIGINE,
  ATTRAITS,
  CADRES_DE_VIE,
  TEMPS_DISPONIBLE,
  BUDGETS,
} from "../utils/scoring";

/**
 * 9 questions fermées du quiz. `type` détermine le composant de saisie :
 * "cartes" (cartes visuelles), "choix" (boutons radio), "select", "oui-non".
 * Q9 (région) est purement informatif (analytics), sans poids de scoring.
 */
export const QUESTIONS = [
  {
    id: "Q1",
    type: "choix",
    titre: "Quel était votre secteur d'activité avant votre reconversion ?",
    options: SECTEURS_ORIGINE.map((s) => s.value),
  },
  {
    id: "Q2",
    type: "select",
    titre: "Quel est votre niveau d'études actuel ?",
    options: NIVEAU_ETUDES.map((n) => ({ value: n.value, label: n.label })),
  },
  {
    id: "Q3",
    type: "choix",
    titre: "Dans quel cadre de vie souhaitez-vous exercer votre futur métier ?",
    options: CADRES_DE_VIE,
  },
  {
    id: "Q4",
    type: "cartes",
    titre: "Qu'est-ce qui vous attire le plus dans un métier ?",
    options: ATTRAITS.map((a) => a.value),
  },
  {
    id: "Q5",
    type: "oui-non",
    titre: "Avez-vous des contraintes physiques ou de mobilité ?",
  },
  {
    id: "Q6",
    type: "select",
    titre: "Combien de temps pouvez-vous consacrer à votre reconversion ?",
    options: TEMPS_DISPONIBLE.map((t) => ({ value: t, label: t })),
  },
  {
    id: "Q7",
    type: "select",
    titre: "Quel budget pouvez-vous consacrer à votre reconversion ?",
    options: BUDGETS.map((b) => ({ value: b.value, label: b.value })),
  },
  {
    id: "Q8",
    type: "oui-non",
    titre: "Avez-vous déjà une expérience en agriculture ?",
  },
  {
    id: "Q9",
    type: "region",
    titre: "Dans quelle région habitez-vous ?",
  },
];

export const REGIONS_FRANCE = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur",
  "Guadeloupe",
  "Martinique",
  "Guyane",
  "La Réunion",
  "Mayotte",
];
