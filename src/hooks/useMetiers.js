import { useState, useEffect } from "react";
import { fetchFromSheet, parseMetiers, getFromCache, saveToCache } from "../utils/sheetsFetch";

export function useMetiers() {
  const [metiers, setMetiers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = getFromCache();
        if (cached) {
          if (!cancelled) { setMetiers(cached); setLoading(false); }
          return;
        }

        const values = await fetchFromSheet();
        const parsed = parseMetiers(values);
        saveToCache(parsed);
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
