#!/usr/bin/env node
/**
 * Génère public/metiers.json à partir du CSV des métiers OYA.
 * Usage : node scripts/build-metiers.cjs [chemin-csv]
 *
 * Le CSV source est la copie exportée de l'onglet "Métiers" du Google Sheet.
 * Si Boris modifie les pondérations dans le Sheet, exporter l'onglet en CSV,
 * remplacer le fichier source, puis relancer ce script + redéployer.
 */
const fs = require("fs");
const path = require("path");

const csvPath = process.argv[2] || path.join(__dirname, "..", "CSV_87_Metiers_OYA_V2_Niveau_MIN.csv");
const outPath = path.join(__dirname, "..", "public", "metiers.json");

// Poids par défaut par question (importance générique, modifiable par métier dans le Sheet "Métiers")
// Q6 (temps disponible) n'a pas de correspondance dans les données métiers : poids 0, informatif seulement.
const DEFAULT_WEIGHTS = {
  Q1: 0.8, // secteur d'origine -> Type activité
  Q2: 0.6, // niveau d'études -> Niveau_MIN
  Q3: 0.7, // cadre de vie -> Localisation
  Q4: 0.9, // ce qui attire -> Type activité / Relation vivant
  Q5: 0.5, // contraintes physiques -> Type activité (pénibilité)
  Q6: 0,   // temps disponible -> informatif uniquement, pas de scoring
  Q7: 0.6, // budget -> Situation
  Q8: 0.8, // expérience agriculture -> Bloc / Statut
};

function parseCsvLine(line) {
  const res = [];
  let cur = "";
  let inq = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inq) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inq = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inq = true;
    } else if (c === ",") {
      res.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  res.push(cur);
  return res;
}

function splitCombo(value) {
  return value
    .split("/")
    .map((v) => v.trim())
    .filter(Boolean);
}

const raw = fs.readFileSync(csvPath, "utf8");
const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
const headers = parseCsvLine(lines[0]);
const rows = lines.slice(1).map(parseCsvLine);

const metiers = rows.map((cols, index) => {
  const get = (name) => {
    const i = headers.indexOf(name);
    return i === -1 ? "" : (cols[i] || "").trim();
  };

  const intentionsCles = get("Intentions clés")
    .split("-")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id: index + 1,
    metier: get("Métier"),
    bloc: get("Bloc"),
    statut: get("Statut"),
    niveauMin: Number(get("Niveau_MIN")) || 4,
    typeMetierGenerique: get("Type métier générique"),
    thematiqueFormation: get("Thématique formation"),
    competencesCles: intentionsCles,
    formationsPrioritaires: get("Formations prioritaires"),
    localisation: splitCombo(get("Localisation")),
    situation: splitCombo(get("Situation")),
    backgroundMin: get("Background min"),
    relationVivant: splitCombo(get("Relation vivant")),
    typeActivite: get("Type activité"),
    reve: get("Rêve"),
    poids: { ...DEFAULT_WEIGHTS },
  };
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(metiers, null, 2), "utf8");
console.log(`${metiers.length} métiers écrits dans ${outPath}`);
