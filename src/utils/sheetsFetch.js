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
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API ${res.status}: ${body}`);
  }

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

// Trouve l'index d'une colonne par son nom (insensible à la casse, trim).
// Accepte plusieurs noms alternatifs pour gérer les variantes du Sheet.
function findCol(header, ...names) {
  for (const name of names) {
    const idx = header.findIndex(
      h => h?.trim().toLowerCase() === name.toLowerCase()
    );
    if (idx !== -1) return idx;
  }
  return -1;
}

export function parseMetiers(values) {
  if (!values || values.length < 2) return [];

  const [headerRow, ...rows] = values;

  // Détection des colonnes par nom — fonctionne quelle que soit l'ordre du Sheet.
  const C = {
    metier:   findCol(headerRow, "Métier", "Metier"),
    bloc:     findCol(headerRow, "Bloc"),
    pQ1:      findCol(headerRow, "Poids_Q1"),
    pQ2:      findCol(headerRow, "Poids_Q2"),
    pQ3:      findCol(headerRow, "Poids_Q3"),
    pQ4:      findCol(headerRow, "Poids_Q4"),
    pQ5:      findCol(headerRow, "Poids_Q5"),
    pQ6:      findCol(headerRow, "Poids_Q6"),
    pQ7:      findCol(headerRow, "Poids_Q7"),
    pQ8:      findCol(headerRow, "Poids_Q8"),
    // Noms alternatifs selon les différentes versions du Sheet
    typeAct:  findCol(headerRow, "Autonomie", "Type_activite", "Type_metier", "Type_métier"),
    niveau:   findCol(headerRow, "Niveau", "Niveau_MIN"),
    penurie:  findCol(headerRow, "Pénurie", "Penurie"),
    evolution:findCol(headerRow, "Évolution", "Evolution"),
    competences: findCol(headerRow, "Compétences", "Competences", "Competences_cles"),
    secteur:  findCol(headerRow, "Secteur"),
    statut:   findCol(headerRow, "Statut"),
  };

  if (import.meta.env.DEV) {
    console.log("[OYA] Header Sheet:", headerRow);
    console.log("[OYA] Colonnes détectées:", C);
  }

  // Fallback sur indices hardcodés (structure Sheet_Metiers_import) si header absent/inconnu
  const fallback = {
    metier: 0, bloc: 1,
    pQ1: 2, pQ2: 3, pQ3: 4, pQ4: 5, pQ5: 6, pQ6: 7, pQ7: 8, pQ8: 9,
    secteur: 10, typeAct: 11, penurie: 12, evolution: 13, competences: 14, niveau: 15,
  };
  for (const key of Object.keys(C)) {
    if (C[key] === -1) C[key] = fallback[key] ?? -1;
  }

  const g = (row, col) => (col >= 0 ? row[col] ?? "" : "");
  // Google Sheets en locale française utilise "0,55" au lieu de "0.55"
  const pf = (val) => parseFloat(String(val).replace(",", ".")) || 0;

  return rows
    .filter(row => g(row, C.metier))
    .map((row, idx) => {
      const poids = {
        Q1: pf(g(row, C.pQ1)),
        Q2: pf(g(row, C.pQ2)),
        Q3: pf(g(row, C.pQ3)),
        Q4: pf(g(row, C.pQ4)),
        Q5: pf(g(row, C.pQ5)),
        Q6: pf(g(row, C.pQ6)),
        Q7: pf(g(row, C.pQ7)),
        Q8: pf(g(row, C.pQ8)),
      };

      if (idx === 0 && import.meta.env.DEV) {
        console.log("[OYA] 1er métier:", g(row, C.metier), "→ poids:", poids);
        const allZero = Object.values(poids).every(v => v === 0);
        if (allZero) console.warn("[OYA] ⚠️ TOUS LES POIDS = 0 — colonnes Poids_Q1-Q8 introuvables dans le Sheet");
      }

      return {
        id: idx,
        metier: g(row, C.metier),
        bloc: g(row, C.bloc),
        thematiqueFormation: g(row, C.bloc),
        poids,
        typeActivite: g(row, C.typeAct),
        niveauMin: NIVEAU_TO_MIN[g(row, C.niveau)] ?? 4,
        statut: g(row, C.statut) === "Tension" ? "Tension"
              : g(row, C.evolution) === "Émergent" ? "Émergent"
              : "",
        localisation: ["Flexible"],
        situation: [],
        relationVivant: [],
        secteur: g(row, C.secteur),
        typemetier: g(row, C.typeAct),
        penurie: g(row, C.penurie),
        evolution: g(row, C.evolution),
        competencesCles: g(row, C.competences).split(",").map(s => s.trim()).filter(Boolean),
        niveau: g(row, C.niveau),
      };
    });
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

export function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TS_KEY);
  } catch {
    // ignore
  }
}
