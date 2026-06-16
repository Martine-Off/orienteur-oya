/**
 * Point d'intégration UNIQUE avec le backend (Google Apps Script ou autre).
 * L'endpoint est configurable via VITE_LEADS_ENDPOINT (.env) : Martine peut
 * changer le backend sans toucher au code React.
 *
 * IMPORTANT — Google Apps Script ne gère pas le préflight CORS :
 *   - mode: "no-cors" évite le préflight (sinon le POST n'est jamais envoyé)
 *   - Content-Type: "text/plain" (et non "application/json", qui déclenche
 *     un préflight) ; le corps reste un JSON.stringify classique
 *   - En mode no-cors, la réponse est opaque : on ne peut pas lire son statut.
 *     L'absence d'erreur réseau (fetch ne rejette pas) est considérée comme
 *     un succès — c'est une limite connue et acceptée du POC.
 */
export async function submitLead(payload) {
  const endpoint = import.meta.env.VITE_LEADS_ENDPOINT;

  if (!endpoint) {
    throw new Error("VITE_LEADS_ENDPOINT n'est pas configuré (voir .env.example)");
  }

  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
  });

  return true;
}
