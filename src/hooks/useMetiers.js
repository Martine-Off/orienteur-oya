import { useEffect, useState } from "react";

/**
 * Charge les métiers une seule fois au mount (public/metiers.json),
 * généré depuis l'onglet "Métiers" du Sheet via scripts/build-metiers.cjs.
 * Évite de refetch à chaque question (cf. note-de-cadrage, risque perf).
 */
export function useMetiers() {
  const [metiers, setMetiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/metiers.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur chargement métiers (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setMetiers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { metiers, loading, error };
}
