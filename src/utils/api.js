/**
 * Point d'intégration UNIQUE avec le backend (Google Apps Script ou autre).
 * L'endpoint est configurable via VITE_LEADS_ENDPOINT (.env) : Martine peut
 * changer le backend sans toucher au code React.
 *
 * CORS & Google Apps Script :
 *   - Content-Type: "text/plain" évite le préflight OPTIONS (que Apps Script
 *     ne gère pas) tout en restant une "simple request" CORS.
 *   - Le corps reste un JSON.stringify classique, parsé par JSON.parse()
 *     côté Apps Script.
 *   - Apps Script renvoie Access-Control-Allow-Origin: * → on peut lire
 *     la réponse et détecter les erreurs backend (Brevo, clé manquante…).
 */
export async function submitLead(payload) {
  const endpoint = import.meta.env.VITE_LEADS_ENDPOINT;

  if (!endpoint) {
    throw new Error("VITE_LEADS_ENDPOINT n'est pas configuré (voir .env.example)");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  const text = await res.text();

  if (text === "OK") {
    return true;
  }

  // Erreurs backend explicites renvoyées par doPost
  if (text.startsWith("EMAIL_ERROR:")) {
    const detail = text.slice("EMAIL_ERROR:".length);
    console.error("[OYA] Brevo error:", detail);
    throw new Error("Erreur d'envoi de l'email : " + detail);
  }
  if (text === "RGPD consent required") {
    throw new Error("Le consentement RGPD est requis.");
  }
  if (text === "Invalid email") {
    throw new Error("Adresse email invalide.");
  }

  throw new Error("Erreur serveur : " + text);
}
