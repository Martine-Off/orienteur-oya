#!/usr/bin/env node
/**
 * Génère les CSV prêts à importer dans le Google Sheet (onglets Métiers,
 * Réponses, Analytics). À lancer après build-metiers.cjs.
 * Usage : node scripts/build-sheet-templates.cjs
 */
const fs = require("fs");
const path = require("path");

const metiersJsonPath = path.join(__dirname, "..", "public", "metiers.json");
const outDir = path.join(__dirname, "..", "google-apps-script", "sheet-templates");
fs.mkdirSync(outDir, { recursive: true });

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

// ---------- Onglet "Métiers" ----------
const metiers = JSON.parse(fs.readFileSync(metiersJsonPath, "utf8"));

const metiersHeaders = [
  "Métier",
  "Bloc",
  "Statut",
  "Niveau_MIN",
  "Background_min",
  "Localisation",
  "Situation",
  "Relation_vivant",
  "Type_activite",
  "Competences_cles",
  "Poids_Q1",
  "Poids_Q2",
  "Poids_Q3",
  "Poids_Q4",
  "Poids_Q5",
  "Poids_Q6",
  "Poids_Q7",
  "Poids_Q8",
];

const metiersRows = metiers.map((m) => [
  m.metier,
  m.bloc,
  m.statut,
  m.niveauMin,
  m.backgroundMin,
  m.localisation.join("/"),
  m.situation.join("/"),
  m.relationVivant.join("/"),
  m.typeActivite,
  m.competencesCles.join(" - "),
  m.poids.Q1,
  m.poids.Q2,
  m.poids.Q3,
  m.poids.Q4,
  m.poids.Q5,
  m.poids.Q6,
  m.poids.Q7,
  m.poids.Q8,
]);

fs.writeFileSync(
  path.join(outDir, "Metiers.csv"),
  toCsv([metiersHeaders, ...metiersRows]),
  "utf8",
);

// ---------- Onglet "Réponses" (en-têtes uniquement) ----------
const reponsesHeaders = [
  "date_heure",
  "email",
  "Q1_secteur",
  "Q2_niveau",
  "Q3_cadre_de_vie",
  "Q4_attire",
  "Q5_contraintes",
  "Q6_temps",
  "Q7_budget",
  "Q8_agri",
  "Q9_region",
  "top_1_métier",
  "top_2_métier",
  "top_3_métier",
  "score_1",
  "score_2",
  "score_3",
  "région",
  "bloc",
  "être_tenu_au_courant",
];

fs.writeFileSync(path.join(outDir, "Reponses.csv"), toCsv([reponsesHeaders]), "utf8");

// ---------- Onglet "Analytics" (formules pré-construites) ----------
const analyticsRows = [
  ["TCD 1 : Nombre de diagnostics par région (colonne R = région)"],
  ["Région", "Nombre"],
  ["Île-de-France", '=COUNTIF(Réponses!R:R,"Île-de-France")'],
  ["Auvergne-Rhône-Alpes", '=COUNTIF(Réponses!R:R,"Auvergne-Rhône-Alpes")'],
  ["..." , "(dupliquer la ligne pour chaque région utile)"],
  [],
  ["TCD 2 : Top métiers recommandés (top_1)"],
  ["Métier", "Nombre"],
  ['=UNIQUE(FILTER(Réponses!L:L, Réponses!L:L<>""))', '=COUNTIF(Réponses!L:L, A9)'],
  [],
  ["TCD 3 : Distribution par bloc"],
  ["Bloc", "Nombre"],
  ["Production agricole", '=COUNTIF(Réponses!S:S,"Production agricole")'],
  ["Transformation agroalimentaire", '=COUNTIF(Réponses!S:S,"Transformation agroalimentaire")'],
  ["Logistique distribution", '=COUNTIF(Réponses!S:S,"Logistique distribution")'],
  ["Restauration", '=COUNTIF(Réponses!S:S,"Restauration")'],
  [],
  ["TCD 4 (bonus) : Budget moyen par région — à construire avec un tableau croisé dynamique natif Google Sheets (Données > Tableau croisé dynamique) sur la feuille Réponses"],
];

fs.writeFileSync(path.join(outDir, "Analytics.csv"), toCsv(analyticsRows), "utf8");

console.log(`Templates écrits dans ${outDir}`);
