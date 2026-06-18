// Google Sheet natif OYA POC (ID différent du xlsx Drive qui est la source éditable)
const SHEET_ID = "1Qy1fYOnCBFZHMHwu0RZ2n5-wI8_RZDsQ3YmUuG0QF-s";
const RANGE = "Métiers!A1:P77";
const CACHE_KEY = "oya_metiers";
const CACHE_TS_KEY = "oya_metiers_timestamp";
const CACHE_TTL_H = 24;

export async function fetchFromSheet() {
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  if (!apiKey) throw new Error("VITE_GOOGLE_SHEETS_API_KEY manquant dans .env");

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/` +
    `${encodeURIComponent(RANGE)}?key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets API ${res.status}: ${res.statusText}`);

  const json = await res.json();
  if (!json.values || json.values.length === 0)
    throw new Error("Onglet 'Métiers' vide ou introuvable");

  return json.values; // [header, row1, row2, ...]
}

// Mapping colonne Niveau → niveauMin numérique attendu par scoreMetier
// Supporte les valeurs actuelles du Sheet (BTS/BTSA) et les alias cibles (Bac+2…)
const NIVEAU_TO_MIN = {
  "CAP/BEP": 3, "Bac": 4,
  "BTS/BTSA": 5, "Bac+2": 5, "Bac+3": 5,
  "Licence": 6, "Bac+5": 7, "Master": 7,
};

// Structure actuelle du Sheet (colonnes A-P, indices 0-15) :
//   A(0)=Métier  B(1)=Bloc  C-J(2-9)=Poids_Q1-Q8
//   K(10)=Secteur  L(11)=Autonomie/Type_métier  M(12)=Pénurie
//   N(13)=Évolution  O(14)=Compétences  P(15)=Niveau
//
// Structure CIBLE après reorder Sheet (voir data/Metiers_CIBLE_clean.csv) :
//   K(10)=Compétences  L(11)=Niveau  M(12)=Secteur  N(13)=Type_métier
//   O(14)=Pénurie  P(15)=Évolution
// → Mettre à jour les indices ci-dessous après avoir importé Metiers_CIBLE_clean.csv dans le Sheet.

export function parseMetiers(values) {
  const [, ...rows] = values; // on ignore le header (ligne 0)

  return rows
    .filter(row => row[0])
    .map((row, idx) => ({
      id: idx,
      metier: row[0] || "",
      bloc: row[1] || "",
      // thematiqueFormation = bloc (le Sheet n'a pas de colonne dédiée)
      // Utilisé par groupByThematique() pour regrouper les résultats
      thematiqueFormation: row[1] || "",
      poids: {
        Q1: parseFloat(row[2]) || 0,
        Q2: parseFloat(row[3]) || 0,
        Q3: parseFloat(row[4]) || 0,
        Q4: parseFloat(row[5]) || 0,
        Q5: parseFloat(row[6]) || 0,
        Q6: parseFloat(row[7]) || 0,
        Q7: parseFloat(row[8]) || 0,
        Q8: parseFloat(row[9]) || 0,
      },
      // Champs dérivés pour scoreMetier()
      typeActivite: row[11] || "",           // L = Autonomie (valeurs : Piloter/Produire/Former/Analyser/Transformer)
      niveauMin: NIVEAU_TO_MIN[row[15]] ?? 4, // P = Niveau → entier 3-7
      statut: row[12] === "En tension" ? "Tension"
            : row[13] === "Émergent"   ? "Émergent"
            : "",
      localisation: ["Flexible"],            // absent du Sheet → neutre pour Q3
      situation: [],                         // absent du Sheet → 0.5 neutre pour Q7
      relationVivant: [],                    // absent du Sheet → partial match Q4
      // Champs display
      secteur: row[10] || "",
      typemetier: row[11] || "",             // alias de typeActivite pour affichage
      penurie: row[12] || "",
      evolution: row[13] || "",
      competencesCles: (row[14] || "").split(",").map(s => s.trim()).filter(Boolean),
      niveau: row[15] || "",
    }));
}

export function getFromCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const ts = localStorage.getItem(CACHE_TS_KEY);
    if (!raw || !ts) return null;

    const ageH = (Date.now() - parseInt(ts, 10)) / 3_600_000;
    if (ageH > CACHE_TTL_H) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TS_KEY);
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch {
    // localStorage plein ou bloqué (SSR, mode privé strict) → on ignore
  }
}
