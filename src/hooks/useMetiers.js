import { useState, useEffect } from "react";
import { fetchFromSheet, parseMetiers, getFromCache, saveToCache, clearCache } from "../utils/sheetsFetch";

// Vérifie si les données métiers ont des poids valides (au moins 1 métier avec poids > 0)
function hasValidPoids(metiers) {
  return metiers?.some(m => Object.values(m.poids || {}).some(v => v > 0));
}

export function useMetiers() {
  const [metiers, setMetiers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = getFromCache();
        // Invalide le cache si les poids sont tous à 0 (données corrompues)
        if (cached && hasValidPoids(cached)) {
          if (!cancelled) { setMetiers(cached); setLoading(false); }
          return;
        }
        if (cached && !hasValidPoids(cached)) {
          console.warn("[OYA] Cache invalide (poids=0), refetch depuis le Sheet");
          clearCache();
        }

        const values = await fetchFromSheet();
        const parsed = parseMetiers(values);
        if (hasValidPoids(parsed)) {
          saveToCache(parsed);
        } else {
          console.warn("[OYA] Sheet sans poids valides — fallback vers metiers.json");
          throw new Error("poids invalides dans le Sheet");
        }
        if (!cancelled) { setMetiers(parsed); setError(null); }
      } catch (err) {
        console.warn("Sheets API indisponible, fallback vers metiers.json", err);
        try {
          const res = await fetch("/metiers.json");
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const fallback = await res.json();
          if (!cancelled) { setMetiers(fallback); setError(null); }
        } catch (err2) {
          console.error("Fallback metiers.json échoué", err2);
          if (!cancelled) { setMetiers([]); setError("Impossible de charger les métiers"); }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { metiers, loading, error };
}
