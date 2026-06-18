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

export function parseMetiers(values) {
  const [, ...rows] = values; // on ignore le header (ligne 0)

  // Colonnes : A=Métier B=Bloc C-J=Poids_Q1-Q8 K=Secteur L=Autonomie
  //            M=Pénurie N=Évolution O=Compétences P=Niveau
  return rows
    .filter(row => row[0])
    .map((row, idx) => ({
      id: idx,
      metier: row[0] || "",
      bloc: row[1] || "",
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
      secteur: row[10] || "",
      autonomie: row[11] || "",
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
