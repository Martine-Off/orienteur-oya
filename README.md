# L'Orienteur OYA

Quiz d'orientation métier pour [OYA](https://oya.fr) — transition alimentaire.  
Un candidat répond à 9 questions, obtient ses 3 métiers les plus compatibles (score 0-100), puis reçoit son diagnostic par email après consentement RGPD.

**Demo live :** https://orienteur-oya.netlify.app

---

## Stack technique

| Couche | Techno |
|---|---|
| Frontend | React 18 + Vite, react-router-dom v7 |
| Données métiers | `public/metiers.json` (généré depuis CSV, 76 métiers) |
| Scoring | Fonction pure `src/utils/scoring.js` (aucune dépendance React) |
| Backend | Google Apps Script (`google-apps-script/Code.gs`) |
| Email | Brevo transactional API v3 |
| Stockage leads | Google Sheets onglet "Réponses" |
| Déploiement | Netlify (CI/CD depuis GitHub) |
| Tests E2E | Cypress 15 (8 scénarios, `cypress/e2e/quiz.cy.js`) |

---

## Installation locale

```bash
git clone https://github.com/Martine-Off/orienteur-oya.git
cd orienteur-oya
npm install
cp .env.example .env.local   # puis renseigner VITE_LEADS_ENDPOINT
npm run dev                  # http://localhost:5173
```

Sans `VITE_LEADS_ENDPOINT`, le quiz et le scoring fonctionnent normalement ; seul l'envoi email + Sheet est désactivé (aucune erreur visible).

### Scripts utiles

```bash
npm run build           # build de production → dist/
npm run preview         # servir le build de prod en local
npm run build:metiers   # régénérer public/metiers.json depuis le CSV
npm run test:e2e        # Cypress headless (CI)
npm run test:e2e:open   # Cypress interactif
```

---

## Variables d'environnement

Copier `.env.example` en `.env.local` (jamais commité) :

```
VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXXX/exec
```

Cette URL est l'URL de déploiement du Google Apps Script (section "Backend" ci-dessous).  
À configurer aussi dans Netlify → Site configuration → Environment variables.

---

## Déploiement Netlify

Le site se déploie automatiquement à chaque push sur `main`.

Configuration initiale :
1. Netlify → Add new site → Import from GitHub → sélectionner ce repo
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Environment variables : ajouter `VITE_LEADS_ENDPOINT`
5. Deploy

La règle `public/_redirects` (`/* /index.html 200`) gère le routing SPA.

---

## Backend — Google Apps Script

Le script reçoit le POST JSON du quiz, insère une ligne dans Google Sheets et envoie l'email Brevo.

**Installation :**
1. Ouvrir le Google Sheet du projet → Extensions → Apps Script
2. Coller le contenu de `google-apps-script/Code.gs`
3. Project Settings → Script properties → ajouter `BREVO_API_KEY`
4. Déployer → Nouveau déploiement → Application Web  
   - Exécuter en tant que : Moi  
   - Qui a accès : Tout le monde
5. Copier l'URL `.../exec` → la mettre dans `VITE_LEADS_ENDPOINT`

**Schéma du flux :**
```
React (Vite) ── POST JSON (no-cors) ──▶ Google Apps Script (doPost)
                                             ├─▶ Google Sheet "Réponses"
                                             └─▶ Brevo API → email candidat
```

> **CORS** : Apps Script ne gère pas le préflight. Le POST est envoyé en `mode: "no-cors"` avec `Content-Type: "text/plain"`. La réponse est opaque côté React — l'absence d'erreur réseau est considérée comme un succès.

---

## Structure Google Sheet

Trois onglets : `Métiers`, `Réponses`, `Analytics`.

Les templates CSV prêts à importer sont dans `google-apps-script/sheet-templates/`.

| Onglet | Rôle |
|---|---|
| Métiers | Source de vérité — colonnes `Poids_Q1`…`Poids_Q8` modifiables sans toucher au code |
| Réponses | Une ligne par lead (date, email, Q1-Q9, top 3 métiers, scores, consentement) |
| Analytics | Formules `COUNTIF` simples (par région, par métier, par bloc) |

---

## Scoring

Formule : `score = Σ(match_i × poids_i) / Σ(poids_i) × 100`

`match_i ∈ {0, 0.5, 1}` selon la correspondance réponse ↔ attribut métier.  
`poids_i` vit dans le champ `poids` de chaque métier — Boris peut les ajuster dans le Sheet sans toucher au code.

| Question | Attribut métier | Poids défaut |
|---|---|---|
| Q1 secteur d'origine | `typeActivite` | 0.8 |
| Q2 niveau d'études | `niveauMin` | 0.6 |
| Q3 cadre de vie | `localisation` | 0.7 |
| Q4 ce qui attire | `typeActivite` + `relationVivant` | 0.9 |
| Q5 contraintes physiques | pénibilité de `typeActivite` | 0.5 |
| Q6 temps disponible | — (analytics uniquement) | 0 |
| Q7 budget | `situation` | 0.6 |
| Q8 expérience agriculture | `bloc` / `statut` | 0.8 |
| Q9 région | — (analytics uniquement) | — |

---

## Troubleshooting

**`npm install` échoue avec `EBADF` / `ENOTEMPTY`**  
Le dossier est synchronisé par un client cloud (Google Drive, OneDrive) qui verrouille `node_modules`. Travailler depuis un chemin local non synchronisé (ex : `C:\dev\orienteur-oya`).

**`npm install cypress` échoue avec `unable to verify the first certificate`**  
Proxy d'entreprise qui inspecte le TLS. Contournement local uniquement :
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install -D cypress
```

**`Cypress.exe: bad option: --smoke-test`**  
Outil de sécurité d'entreprise qui altère les arguments Electron. Le binaire est valide ; les tests s'exécutent normalement en CI (Netlify, GitHub Actions).

**Le POST vers Apps Script ne fait rien**  
Vérifier que l'URL est bien `.../exec` (pas `/dev`), que le déploiement est "Qui a accès : Tout le monde", et que `mode: "no-cors"` + `Content-Type: "text/plain"` sont utilisés.

**Brevo : email non envoyé**  
- Vérifier que `BREVO_API_KEY` est dans Script properties (pas hardcodée)
- Vérifier que le sender email est vérifié dans Brevo (Senders & IP → Domains)
- Lire les logs : Apps Script → Exécutions → détail de la dernière exécution

---

## Accessibilité & responsive

- Lighthouse Accessibility : **100/100**
- Lighthouse Performance (build prod) : **99/100**
- Layout testé : 375px (mobile), 768px (tablette), 1440px (desktop)
- Navigation clavier : `Tab` / `Enter` / `Escape` (confirmation de sortie)
- Radios natifs `<input type="radio">` — compatibles lecteurs d'écran

---

## Notes sur les données

- Le CSV fourni contient **76 métiers** (pas 87 comme indiqué dans le cahier des charges initial). Le code s'adapte dynamiquement au nombre de lignes.
- Les compétences affichées viennent du champ `Intentions clés` du CSV, découpé sur les tirets.
- Les poids par défaut sont identiques pour tous les métiers au démarrage du POC. Boris peut les différencier métier par métier dans l'onglet Métiers du Sheet.
