# Audit de sécurité — L'Orienteur OYA POC

**Date :** 2026-06-22  
**Périmètre :** code source complet (branche `main`)

---

## Failles trouvées et corrigées

| # | Criticité | Fichier | Problème | Statut |
|---|-----------|---------|----------|--------|
| 1 | **CRITIQUE** | `scripts/SendEmailBrevo.gs` | HTML injection dans les emails — champs utilisateur (`thematique`, `metier`, `peurs`, `region`…) interpolés sans échappement dans le template HTML envoyé via Brevo | ✅ Corrigé — `escapeHtml()` ajoutée, appliquée sur tous les champs |
| 2 | **CRITIQUE** | `scripts/Code.gs` | Bypass RGPD côté serveur — `rgpd_accepte` jamais vérifié dans `doPost()`, n'importe quel POST direct contournait le consentement | ✅ Corrigé — guard RGPD avant `appendReponse()` |
| 3 | **IMPORTANT** | `scripts/Code.gs` | Validation email absente côté serveur — toute chaîne non-vide acceptée comme email | ✅ Corrigé — regex `EMAIL_REGEX` dans `doPost()` |
| 4 | **IMPORTANT** | `src/utils/sheetsFetch.js` | `console.log` de structure interne (noms colonnes, poids métiers) visible en prod dans DevTools | ✅ Corrigé — conditionné à `import.meta.env.DEV` |

---

## Action manuelle avant déploiement prod

### VITE_GOOGLE_SHEETS_API_KEY

La clé API Google Sheets est visible dans les DevTools du navigateur (bundle Vite client).
Ce n'est pas un secret commité en git — la clé vit uniquement dans les variables d'environnement
Netlify. Mais elle doit être **restreinte** pour limiter l'usage abusif.

**Pour restreindre :**

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials** → ta clé API
2. **Application restrictions** → HTTP referrers (web sites)
3. Ajouter les domaines :
   - `https://orienteur-oya.netlify.app/*`
   - `http://localhost:5173/*` (dev local uniquement)
4. **API restrictions** → cocher **Google Sheets API** uniquement
5. Enregistrer

Avec ces restrictions, la clé exposée côté client ne peut être utilisée que pour lire le Sheet
depuis le domaine autorisé — risque résiduel acceptable pour un POC.

**Détails :** [Restreindre une clé API — Google Cloud](https://cloud.google.com/docs/authentication/api-keys#restrict_an_api_key)

---

## Points bien gérés

- Brevo API key en `PropertiesService` (jamais exposée côté client, jamais en git)
- Aucun secret dans `git log` (`.env` dans `.gitignore`, `.env.example` avec placeholders)
- RGPD enforced côté client (checkbox bloque le bouton) ET côté serveur (guard dans `doPost()`)
- Aucun `dangerouslySetInnerHTML` dans les composants React
- Redirect `/results` et `/email` vers `/quiz` si état manquant (pas d'accès direct aux résultats)

---

## V2 : Améliorer

- **Rate limiting sur `doPost()`** — le endpoint GAS est public sans quota ; un bot peut spammer
  la Sheet et déclencher des envois Brevo en masse (risque de dépassement quota Brevo)
- **Audit logs** — tracer qui a modifié les pondérations dans l'onglet Métiers (Google Sheets
  intègre un historique des versions, mais pas d'alerte active)
- **Encryption réponses en transit** — le POST part déjà en HTTPS ; envisager un token signé
  côté Apps Script pour n'accepter que les requêtes venant du domaine Netlify autorisé
