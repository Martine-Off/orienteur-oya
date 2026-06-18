import {
  NIVEAU_ETUDES,
  SECTEURS_ORIGINE,
  ATTRAITS,
  CADRES_DE_VIE,
  TEMPS_DISPONIBLE,
  BUDGETS,
} from "../utils/scoring";

export const PEURS = [
  { key: "chomage", label: "Chômage" },
  { key: "budget", label: "Budget insuffisant" },
  { key: "competences", label: "Manque de compétences" },
  { key: "physique", label: "Charge de travail physique" },
  { key: "concurrence", label: "Concurrence marché" },
  { key: "isolement", label: "Isolement professionnel" },
  { key: "meteo", label: "Conditions météo / intempéries" },
  { key: "administratif", label: "Difficultés administratives" },
  { key: "terre", label: "Accès à la terre" },
  { key: "marche", label: "Marché local faible" },
];

const ATTRAIT_ICONS = {
  "Produire / cultiver": "/icons/produire.svg",
  "Transformer / créer": "/icons/transformer.svg",
  "Piloter / organiser": "/icons/piloter.svg",
  "Conseiller / former": "/icons/conseiller.svg",
  "Analyser / optimiser": "/icons/analyser.svg",
  "Prendre soin des animaux": "/icons/animaux.svg",
  "Cuisinier / Servir": "/icons/restauration.svg",
  "Partager / Vendre": "/icons/marche.svg",
};

export const QUESTIONS = [
  {
    id: "Q1",
    type: "choix",
    titre: "Quel était votre secteur d'activité avant votre reconversion ?",
    options: SECTEURS_ORIGINE.map((s) => s.value),
  },
  {
    id: "Q2",
    type: "chips",
    titre: "Quel est votre niveau d'études actuel ?",
    options: NIVEAU_ETUDES.map((n) => ({ value: n.value, label: n.label })),
  },
  {
    id: "Q3",
    type: "cartes",
    titre: "Dans quel cadre de vie souhaitez-vous exercer votre futur métier ?",
    options: [
      { value: "Urbain",   icon: "/images/Image1ville.jpg",    label: "Urbain" },
      { value: "Campagne", icon: "/images/Image2campagne.jpg", label: "Campagne" },
      { value: "Flexible", icon: "/images/Image3flexible.jpg", label: "Flexible" },
    ],
  },
  {
    id: "Q4",
    type: "cartes",
    titre: "Qu'est-ce qui vous attire le plus dans un métier ?",
    options: [
      { value: "Produire / cultiver",       icon: "/images/Image4Produire.jpg",       label: "Produire / cultiver" },
      { value: "Transformer / créer",       icon: "/images/Image5Transformer.jpg",    label: "Transformer / créer" },
      { value: "Piloter / organiser",       icon: "/images/Image6Piloter.jpg",        label: "Piloter / organiser" },
      { value: "Conseiller / former",       icon: "/images/Image7Conseiller.jpg",     label: "Conseiller / former" },
      { value: "Analyser / optimiser",      icon: "/images/Image8Analyser.jpg",       label: "Analyser / optimiser" },
      { value: "Prendre soin des animaux",  icon: "/images/Image9Animaux.jpg",        label: "Prendre soin des animaux" },
      { value: "Cuisinier / Servir",        icon: "/images/image10restauration.jpg",  label: "Cuisinier / Servir" },
      { value: "Partager / Vendre",         icon: "/images/image11marche.jpg",        label: "Partager / Vendre" },
    ],
  },
  {
    id: "Q5",
    type: "oui-non",
    titre: "Avez-vous des contraintes physiques ou de mobilité ?",
  },
  {
    id: "Q6",
    type: "chips",
    titre: "Combien de temps pouvez-vous consacrer à votre reconversion ?",
    options: TEMPS_DISPONIBLE.map((t) => ({ value: t, label: t })),
  },
  {
    id: "Q7",
    type: "chips",
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
    type: "checkboxes",
    titre: "Quelles sont vos principales préoccupations ?",
    hint: "Plusieurs réponses possibles — au moins une requise",
    options: PEURS,
  },
  {
    id: "Q10",
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
