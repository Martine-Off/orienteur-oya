# L'Orienteur OYA

Quiz d'orientation métier pour [OYA](https://oya.fr) — la formation aux métiers de la transition alimentaire.  
Un candidat répond à 9 questions fermées, obtient ses 3 métiers les plus compatibles parmi 76 métiers OYA (score 0-100), puis reçoit son diagnostic par email après consentement RGPD explicite.

**Demo live :** https://orienteur-oya.netlify.app  
**Repo :** https://github.com/Martine-Off/orienteur-oya

---

## 1. Stack technique

| Couche | Techno | Rôle |
|---|---|---|
| Frontend | React 18 + Vite | SPA, routage react-router-dom v7 |
| Données métiers | `public/metiers.json` | 76 métiers OYA, généré depuis CSV |
| Scoring | `src/utils/scoring.js` | Fonction pure, zéro dépendance React |
| Backend | Google Apps Script | Reçoit le POST, écrit dans Sheet, envoie email |
| Email transactionnel | Brevo API v3 | Email diagnostic au candidat |
| Stockage leads | Google Sheets | Onglet "Réponses", une ligne par lead |
| Déploiement | Netlify | CI/CD depuis GitHub, build automatique |
| Tests E2E | Cypress 15 | 8 scénarios, `cypress/e2e/quiz.cy.js` |

---

## 2. Architecture

```
┌─────────────────────────────────────────────┐
│  Candidat (navigateur)                      │
│  React 18 + Vite — SPA                      │
│                                             │
│  Landing → Quiz (9 questions)               │
│         → Résultats (top 3 métiers)         │
│         → Formulaire email + RGPD           │
└──────────────┬──────────────────────────────┘
               │  POST JSON (no-cors, text/plain)
               │  VITE_LEADS_ENDPOINT
               ▼
┌──────────────────────────────────────────────┐
│  Google Apps Script (doPost)                 │
│  google-apps-script/Code.gs                  │
│                                              │
│  JSON.parse(e.postData.contents)             │
├──────────────┬───────────────────────────────┤
               │                │
               ▼                ▼
┌──────────────────┐  ┌────────────────────────┐
│  Google Sheets   │  │  Brevo API v3          │
│  Onglet Réponses │  │  /smtp/email           │
│  (1 ligne/lead)  │  │  Email → candidat      │
└──────────────────┘  └────────────────────────┘
```

### Pourquoi no-cors ?

Google Apps Script ne gère pas les requêtes `OPTIONS` (préflight CORS). `api.js` envoie donc le POST en `mode: "no-cors"` avec `Content-Type: "text/plain"` — le corps reste du JSON classique, parsé côté Apps Script via `JSON.parse(e.postData.contents)`. Conséquence : la réponse est opaque côté React ; l'absence d'erreur réseau est considérée comme un succès. C'est une limite connue et documentée du POC.

---

## 3. Installation locale

```bash
git clone https://github.com/Martine-Off/orienteur-oya.git
cd orienteur-oya
npm install
cp .env.example .env.local   # puis renseigner VITE_LEADS_ENDPOINT
npm run dev                  # → http://localhost:5173
```

> **Note Windows** : si le projet est dans un dossier synchronisé par Google Drive ou OneDrive, `npm install` peut échouer avec `EBADF` / `ENOTEMPTY`. Travailler depuis un chemin local non synchronisé (ex : `C:\dev\orienteur-oya`).

### Scripts disponibles

```bash
npm run dev             # Serveur de développement (HMR)
npm run build           # Build de production → dist/
npm run preview         # Servir le build de prod en local
npm run build:metiers   # Régénérer public/metiers.json depuis le CSV
npm run lint            # ESLint
npm run test:e2e        # Cypress headless (CI)
npm run test:e2e:open   # Cypress interactif (local)
```

---

## 4. Variables d'environnement

Copier `.env.example` en `.env.local` (jamais commité, dans `.gitignore`) :

```env
VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXXX/exec
```

Cette URL est l'URL de déploiement du Google Apps Script (voir section 6).  
À configurer également dans **Netlify → Site configuration → Environment variables** avant chaque déploiement.

Sans cette variable, le quiz et le scoring fonctionnent normalement. Seul l'envoi email + Sheet échoue silencieusement (mode no-cors, aucune erreur visible pour l'utilisateur).

---

## 5. Déploiement Netlify

### Configuration initiale

1. Aller sur [app.netlify.com](https://app.netlify.com) → **Add new site → Import from GitHub**
2. Sélectionner le repo `Martine-Off/orienteur-oya`
3. Réglages de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
4. **Environment variables** → Add variable :
   - Clé : `VITE_LEADS_ENDPOINT`
   - Valeur : l'URL Apps Script `.../exec`
5. Cliquer **Deploy site**

### Déploiements suivants

Chaque push sur `main` déclenche un redéploiement automatique.  
Si une variable d'environnement change → **Deploys → Trigger deploy → Deploy site** (Vite intègre les variables au moment du build, pas au runtime).

### Routing SPA

Le fichier `public/_redirects` contient la règle nécessaire pour que React Router fonctionne sur Netlify :

```
/*    /index.html   200
```

Sans cette règle, un rechargement de `/quiz` ou `/resultats` retourne une 404.

---

## 6. Déploiement du backend (Google Apps Script)

1. Ouvrir le **Google Sheet du projet** → **Extensions → Apps Script**
2. Coller le contenu de `google-apps-script/Code.gs` dans l'éditeur
3. **Project Settings (⚙️) → Script properties** → ajouter :
   - Clé : `BREVO_API_KEY`
   - Valeur : la clé API Brevo (commence par `xkeysib-...`)
4. **Déployer → Nouveau déploiement** → Type : Application Web
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
5. Copier l'URL de déploiement (`.../exec`) → la coller dans `VITE_LEADS_ENDPOINT`

### Structure du Google Sheet

Trois onglets — les templates CSV prêts à importer sont dans `google-apps-script/sheet-templates/`.

| Onglet | Rôle |
|---|---|
| **Métiers** | Source de vérité. Colonnes `Poids_Q1`…`Poids_Q8` modifiables par Boris sans toucher au code. |
| **Réponses** | Une ligne par lead : date, email, Q1-Q9, top 3 métiers, scores, région, consentement marketing. |
| **Analytics** | Formules `COUNTIF` simples (répartition par région, par métier, par bloc). |

> Si Boris modifie l'onglet Métiers → exporter en CSV, remplacer `CSV_87_Metiers_OYA_V2_Niveau_MIN.csv`, relancer `npm run build:metiers`, redéployer sur Netlify.

---

## 7. Formule de scoring

```
score_métier = Σ(match_i × poids_i) / Σ(poids_i) × 100
```

- `match_i ∈ {0, 0.5, 1}` : degré de correspondance entre la réponse Qi et l'attribut du métier (0 = aucun rapport, 0.5 = partiel, 1 = match complet)
- `poids_i` : importance de la question pour ce métier — vit dans le champ `poids` du JSON métier, modifiable dans le Sheet sans toucher au code
- Le résultat est arrondi à l'entier le plus proche (`Math.round`)

### Mapping questions → attributs métier

| Question | Ce que ça mesure | Attribut métier | Poids défaut |
|---|---|---|---|
| Q1 — secteur d'origine | Cohérence avec le type d'activité | `typeActivite` | **0.8** |
| Q2 — niveau d'études | Niveau minimum requis | `niveauMin` (3-7) | **0.6** |
| Q3 — cadre de vie | Localisation souhaitée | `localisation` | **0.7** |
| Q4 — ce qui attire | Attrait activité + relation au vivant | `typeActivite` + `relationVivant` | **0.9** |
| Q5 — contraintes physiques | Compatibilité pénibilité | pénibilité de `typeActivite` | **0.5** |
| Q6 — temps disponible | — (informatif, analytics uniquement) | — | **0** |
| Q7 — budget reconversion | Situation financière nécessaire | `situation` | **0.6** |
| Q8 — expérience agriculture | Bonus métiers agricoles / en tension | `bloc` + `statut` | **0.8** |
| Q9 — région | — (informatif, analytics uniquement) | — | — |

Le code de scoring est dans `src/utils/scoring.js` — fonction pure, auditable, zéro dépendance React. Chaque question a sa propre fonction `matchQX` dédiée.

---

## 8. Tests E2E

```bash
npm run test:e2e        # headless (CI)
npm run test:e2e:open   # interactif (local)
```

8 scénarios dans `cypress/e2e/quiz.cy.js` :

| # | Scénario |
|---|---|
| 1 | Parcours complet : quiz → résultats → email + RGPD → confirmation |
| 2 | Validation : bouton "Suivant" désactivé sans réponse |
| 3 | Progression : barre 1/9 → 2/9 |
| 4 | RGPD requis : bouton "Envoyer" désactivé sans consentement |
| 5 | Email invalide : message d'erreur affiché |
| 6 | Navigation arrière : bouton "Précédent" revient à Q1 |
| 7 | Clavier : radios focusables, `focus-within` visible |
| 8 | Mobile 375px : pas de scroll horizontal |

> **Note machine Windows avec EDR d'entreprise** : `Cypress.exe: bad option: --smoke-test` — l'outil de sécurité altère les arguments Electron. Le binaire est valide. Les tests s'exécutent normalement en CI (Netlify, GitHub Actions) où cet environnement n'est pas présent. Voir `README-TECHNIQUE.md` section 10 pour le détail.

---

## 9. Accessibilité (WCAG 2.1 AA)

**Scores Lighthouse (build de production) :**
- Accessibility : **100 / 100** ✅
- Performance : **99 / 100** ✅

### Ce qui est implémenté

| Critère | Implémentation |
|---|---|
| Navigation clavier | `<input type="radio">` natifs — Tab / flèches / Espace sans JS additionnel |
| Focus visible | `:focus-within` sur `.option-pill` et `.option-card` (ring 3px orange sur le label entier) |
| Lecteurs d'écran | `<fieldset>` + `<legend>` pour chaque question, `aria-invalid`, `aria-describedby` sur les champs en erreur |
| Messages d'erreur | `role="alert"` → annoncés automatiquement par les screen readers au changement d'état |
| Dialog modal | `role="dialog"` + `aria-modal="true"` + `aria-label` + `autoFocus` sur le premier bouton |
| Contrastes texte | Blanc sur orange (#EF8D11) : **6.6:1** ✅ — Blanc sur vert (#38AA3F) : **6.0:1** ✅ — Texte sur fond : **>7:1** ✅ |
| Touch targets | Tous les éléments interactifs : `min-height: 44px` |
| Responsive | Layout fluide : 375px (mobile), 768px (tablette), 1440px (desktop) |
| Escape | Ouvre une modale de confirmation de sortie (ne quitte pas abruptement) |
| Éléments décoratifs | `aria-hidden="true"` sur le SVG checkmark de confirmation |

---

## 10. Notes données

- Le CSV fourni contient **76 métiers** (la documentation initiale mentionnait 87 — écart non bloquant, le code s'adapte dynamiquement au nombre de lignes).
- Les compétences affichées viennent du champ `Intentions clés` du CSV, découpé sur les tirets.
- Les poids par défaut sont identiques pour tous les métiers au démarrage du POC. Boris peut les différencier métier par métier dans l'onglet Métiers du Sheet — sans toucher au code.

---

## 11. Troubleshooting

### `npm install` échoue avec `EBADF` / `ENOTEMPTY`

Le dossier projet est synchronisé par un client cloud (Google Drive File Stream, OneDrive) qui pose des verrous sur `node_modules` pendant l'installation. **Solution : travailler depuis un chemin local non synchronisé**, ex : `C:\dev\orienteur-oya`.

### `npm install cypress` — `unable to verify the first certificate`

Proxy d'entreprise qui inspecte le TLS. Contournement pour l'installation locale uniquement (jamais en CI, jamais dans le code) :

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install -D cypress
```

### `Cypress.exe: bad option: --smoke-test`

Outil de sécurité (EDR) qui altère les arguments passés au binaire Electron. Le binaire lui-même est valide. Les tests tournent normalement en CI — voir section 8.

### Le POST vers Apps Script ne fait rien

Vérifier dans l'ordre :
1. `VITE_LEADS_ENDPOINT` pointe vers l'URL `.../exec` (pas `/dev`)
2. Le déploiement Apps Script est configuré "Qui a accès : Tout le monde"
3. `mode: "no-cors"` + `Content-Type: "text/plain"` sont utilisés dans `src/utils/api.js`
4. Apps Script → Exécutions → détail de la dernière exécution (les erreurs sont loguées)

### Brevo : email non envoyé

1. Vérifier que `BREVO_API_KEY` est dans **Project Settings → Script properties** (jamais hardcodée)
2. Vérifier que l'adresse sender est vérifiée dans Brevo : **Senders & IP → Domains**
3. Lire la réponse Apps Script : si elle contient `EMAIL_ERROR:`, le détail de l'erreur Brevo suit (code HTTP + message)
4. Test curl manuel :
   ```bash
   curl -X POST https://api.brevo.com/v3/smtp/email \
     -H "api-key: VOTRE_CLE" \
     -H "Content-Type: application/json" \
     -d '{"to":[{"email":"test@example.com"}],"sender":{"email":"SENDER_VERIFIE","name":"OYA"},"subject":"Test","htmlContent":"<p>OK</p>"}'
   ```
   HTTP 201 = clé et sender OK. HTTP 401 = mauvaise clé. HTTP 400 = sender non vérifié.

### Résultats de scoring incohérents

Ajuster les poids dans l'onglet Métiers du Sheet (colonnes `Poids_Q1`…`Poids_Q8`) ou les fonctions `matchQX` dans `src/utils/scoring.js`. C'est un point d'itération attendu dès le départ du POC.

---

## 12. Crédits & contact

**Projet** : POC L'Orienteur OYA — quiz d'orientation vers les métiers de la transition alimentaire  
**Client** : [OYA](https://oya.fr) — formation professionnelle, agriculture & alimentation  
**Chef de projet** : Martine Desmaroux — m.desmaroux@eisf.fr  
**Données métiers** : Boris (OYA) — `CSV_87_Metiers_OYA_V2_Niveau_MIN.csv`  

Pour toute question sur l'intégration backend (Apps Script, Sheet, Brevo) ou sur le déploiement Netlify, contacter Martine.  
Pour ajuster les métiers ou les pondérations, contacter Boris directement via le Google Sheet (onglet Métiers).
