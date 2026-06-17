/**
 * Moteur de scoring — pur, sans état, sans dépendance React.
 *
 * Formule (cf. gherkin-flux-utilisateur-poc.md) :
 *   score_métier = Σ(match_i × poids_i) / Σ(poids_i) × 100
 *
 * match_i ∈ {0, 0.5, 1} : le degré de correspondance entre la réponse Qi
 * de l'utilisateur et l'attribut du métier concerné (0 = aucun rapport,
 * 0.5 = partiel, 1 = match complet). Les poids (poids_i) viennent du champ
 * `poids` de chaque métier (onglet "Métiers" du Sheet), donc Boris peut les
 * ajuster métier par métier sans toucher au code.
 *
 * Q6 (temps disponible) n'a pas de correspondance dans les données métiers :
 * il est collecté à titre informatif (analytics) et ignoré dans le score
 * (poids par défaut = 0).
 */

// Échelle des niveaux d'études utilisée par Q2, alignée sur Niveau_MIN (3-7)
export const NIVEAU_ETUDES = [
  { value: 3, label: "Sans diplôme / CAP" },
  { value: 4, label: "Bac" },
  { value: 5, label: "BTS / BTSA" },
  { value: 6, label: "Licence" },
  { value: 7, label: "Master et plus" },
];

// Q1 : secteur/type d'activité antérieur -> aligné sur la colonne "Type activité"
export const SECTEURS_ORIGINE = [
  { value: "Management/Encadrement", typeActivite: "Piloter" },
  { value: "Production/Technique", typeActivite: "Produire" },
  { value: "Conseil/Formation", typeActivite: "Former" },
  { value: "Analyse/Gestion", typeActivite: "Analyser" },
  { value: "Industrie/Artisanat", typeActivite: "Transformer" },
  { value: "Autre", typeActivite: null },
];

// Q4 : ce qui attire -> aligné sur "Type activité" + "Relation vivant"
export const ATTRAITS = [
  { value: "Produire / cultiver", typeActivite: "Produire", relationVivant: "Plantes" },
  { value: "Transformer / créer", typeActivite: "Transformer", relationVivant: "Tech" },
  { value: "Piloter / organiser", typeActivite: "Piloter", relationVivant: "Management" },
  { value: "Conseiller / former", typeActivite: "Former", relationVivant: null },
  { value: "Analyser / optimiser", typeActivite: "Analyser", relationVivant: "Tech" },
  { value: "Prendre soin des animaux", typeActivite: null, relationVivant: "Animaux" },
];

export const CADRES_DE_VIE = ["Urbain", "Campagne", "Flexible"];

export const TEMPS_DISPONIBLE = ["< 6 mois", "6-12 mois", "12 mois et plus"];

export const BUDGETS = [
  { value: "0-5k", situation: "Zéro" },
  { value: "5-15k", situation: "Terrain" },
  { value: "15k et plus", situation: "Capital" },
];

// Types d'activité jugés physiquement exigeants (pour Q5, contraintes physiques)
const ACTIVITES_PHYSIQUES = ["Produire", "Transformer"];

function includesAny(list, value) {
  return Array.isArray(list) && value ? list.includes(value) : false;
}

/** Q1 : secteur d'origine vs Type activité du métier */
function matchQ1(reponse, metier) {
  const secteur = SECTEURS_ORIGINE.find((s) => s.value === reponse);
  // "Autre" n'a pas de typeActivite → score neutre (pas de pénalité, pas de bonus).
  if (!secteur || !secteur.typeActivite) return 0.5;
  return secteur.typeActivite === metier.typeActivite ? 1 : 0.5;
}

/** Q2 : niveau d'études vs Niveau_MIN du métier (un niveau suffisant = match complet) */
function matchQ2(reponse, metier) {
  const niveauUtilisateur = Number(reponse);
  const ecart = niveauUtilisateur - metier.niveauMin;
  if (ecart >= 0) return 1; // niveau suffisant
  if (ecart === -1) return 0.5; // un peu sous le niveau requis
  return 0; // largement sous le niveau requis
}

/** Q3 : cadre de vie souhaité vs Localisation du métier */
function matchQ3(reponse, metier) {
  if (reponse === "Flexible" || includesAny(metier.localisation, "Flexible")) return 1;
  return includesAny(metier.localisation, reponse) ? 1 : 0;
}

/** Q4 : ce qui attire vs Type activité + Relation vivant du métier */
function matchQ4(reponse, metier) {
  const attrait = ATTRAITS.find((a) => a.value === reponse);
  if (!attrait) return 0;
  const matchActivite = attrait.typeActivite && attrait.typeActivite === metier.typeActivite;
  const matchRelation = attrait.relationVivant && includesAny(metier.relationVivant, attrait.relationVivant);
  if (matchActivite && matchRelation) return 1;
  if (matchActivite || matchRelation) return 0.5;
  return 0;
}

/** Q5 : contraintes physiques/mobilité vs pénibilité du métier (Type activité) */
function matchQ5(reponse, metier) {
  const aDesContraintes = reponse === "Oui";
  const metierPhysique = ACTIVITES_PHYSIQUES.includes(metier.typeActivite);
  if (!aDesContraintes) return 1;
  // Contrainte physique + métier physique = incompatibilité (0), sinon compatible (1).
  return metierPhysique ? 0 : 1;
}

/** Q7 : budget reconversion vs Situation du métier */
function matchQ7(reponse, metier) {
  const budget = BUDGETS.find((b) => b.value === reponse);
  if (!budget) return 0.5;
  return includesAny(metier.situation, budget.situation) ? 1 : 0.5;
}

/** Q8 : expérience agriculture vs Bloc/Statut du métier */
function matchQ8(reponse, metier) {
  const aExperience = reponse === "Oui";
  if (!aExperience) return 0.5; // neutre, pas de pénalité
  const bonus = metier.bloc === "Production agricole" || metier.statut === "Tension";
  return bonus ? 1 : 0.5;
}

const MATCHERS = {
  Q1: matchQ1,
  Q2: matchQ2,
  Q3: matchQ3,
  Q4: matchQ4,
  Q5: matchQ5,
  Q7: matchQ7,
  Q8: matchQ8,
};

/**
 * Calcule le score 0-100 d'un métier pour un ensemble de réponses.
 * `reponses` : { Q1: "...", Q2: 5, Q3: "...", ... } (Q6 et Q9 ignorés du score)
 */
export function scoreMetier(reponses, metier) {
  let sommePonderee = 0;
  let sommePoids = 0;

  for (const [question, matcher] of Object.entries(MATCHERS)) {
    const reponse = reponses[question];
    // poids vient du JSON métier (public/metiers.json), lui-même généré depuis le Sheet.
    // Boris peut ajuster ces valeurs dans le Sheet sans toucher au code — cf. BORIS-GUIDE.md.
    const poids = metier.poids?.[question] ?? 0;
    // Ignorer les questions sans réponse et les questions non-scorées (poids = 0, ex: Q6).
    if (reponse === undefined || reponse === null || poids === 0) continue;
    sommePonderee += matcher(reponse, metier) * poids;
    sommePoids += poids;
  }

  // Garde-fou : si aucune question scorée n'a de réponse, le score est 0.
  if (sommePoids === 0) return 0;
  return Math.round((sommePonderee / sommePoids) * 100);
}

/** Calcule et trie tous les métiers par score décroissant, retourne le top N */
export function getTopMetiers(reponses, metiers, topN = 3) {
  return metiers
    .map((metier) => ({ metier, score: scoreMetier(reponses, metier) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
