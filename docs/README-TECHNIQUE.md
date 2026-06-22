# L'Orienteur OYA — README technique

## ⚠️ DONNÉES FICTIVES (POC)

Les **20 diagnostics** du Sheet sont des données fictives créées pour valider le POC.
Le code fonctionne en production avec de vraies candidate·s sans modification.

---

## Vue d'ensemble

Quiz d'orientation métier — 10 questions, scoring pur, 3 métiers recommandés parmi 76,
diagnostic envoyé par email (Brevo) après consentement RGPD. Chaque soumission → ligne Google Sheet "Réponses".

**Stack :** React 18 + Vite / Google Apps Script / Google Sheets / Brevo / Netlify

---

## Architecture

```
React (Vite) ──POST JSON (no-cors)──▶ Google Apps Script (Code.gs)
  │                                        ├─▶ Google Sheet "Réponses" (insert ligne)
  │                                        └─▶ Brevo API (email diagnostic)
  │
  └── fetch Google Sheets API ──▶ Onglet "Métiers" (76 métiers + pondérations)
```

### Pourquoi no-cors ?

Apps Script ne supporte pas les requêtes OPTIONS (préflight CORS). React envoie le POST en
`mode: "no-cors"` + `Content-Type: "text/plain"` — corps = JSON valide. Réponse opaque côté
React : absence d'erreur réseau = succès. Limite documentée du POC.

---

## Structure réelle du projet

### Pages (`src/pages/`)

| Fichier | Rôle |
|---|---|
| `Landing.jsx` | Page d'accueil — présentation + CTA "Démarrer" |
| `Quiz.jsx` | Quiz 10 questions — utilise `useQuiz` |
| `Results.jsx` | Top 3 métiers + scores + modal email intégré — utilise `useMetiers` + `scoring` |
| `EmailCapture.jsx` | Page alternative : formulaire email + RGPD après quiz |

**Flux principal :**
Landing → Quiz (Q1-Q10) → Results (top 3 + modal email) → confirmation

**Flux alternatif :**
Quiz → Results → EmailCapture (page dédiée) → confirmation

### Composants (`src/components/`)

| Fichier | Rôle |
|---|---|
| `Question.jsx` | Bloc question (radio buttons ou checkboxes) |
| `ProgressBar.jsx` | Barre de progression (X/10) |
| `MetierCard.jsx` | Carte métier (nom, score, compétences) |
| `ThematicCard.jsx` | Carte thématique (regroupement par bloc) |
| `EmailCaptureForm.jsx` | Formulaire email + case RGPD + case newsletter |
| `RadarChartMetier.jsx` | Radar Recharts profil candidat vs métier |

### Hooks (`src/hooks/`)

| Fichier | Rôle |
|---|---|
| `useQuiz.js` | State quiz : index courant, réponses, navigation (goNext/goPrevious) |
| `useMetiers.js` | Fetch métiers depuis Google Sheets API → cache localStorage 24h → fallback `metiers.json` |

### Utils (`src/utils/`)

| Fichier | Rôle |
|---|---|
| `scoring.js` | Algorithme pur : `(réponses, métiers)` → top 3 thématiques + scores 0-100 |
| `api.js` | `submitLead(payload)` — POST vers `VITE_LEADS_ENDPOINT` en no-cors |
| `validation.js` | `isValidEmail(email)` — regex, `isAnswered(value)` |
| `sheetsFetch.js` | `fetchFromSheet()` + `parseMetiers()` + gestion cache localStorage |

### Data (`src/data/`)

| Fichier | Rôle |
|---|---|
| `questions.js` | Définition des 10 questions (id, texte, options, type) + constante PEURS |

### Scripts Google Apps Script (`scripts/`)

| Fichier | Rôle |
|---|---|
| `Code.gs` | `doPost(e)` — valide email + RGPD, insère ligne Sheet, appelle Brevo |
| `SendEmailBrevo.gs` | `sendEmailBrevo(data)` — construit HTML email + appelle API Brevo |

---

## Démarrer en local

```bash
git clone https://github.com/Martine-Off/orienteur-oya.git
cd orienteur-oya
npm install
cp .env.example .env.local   # renseigner les deux variables
npm run dev                  # → http://localhost:5173
```

Sans `VITE_LEADS_ENDPOINT`, le quiz et le scoring fonctionnent. Seul l'envoi final échoue.

### Variables d'environnement (`.env.local`)

```
VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXXX/exec
VITE_GOOGLE_SHEETS_API_KEY=YOUR_KEY
```

### Scripts disponibles

```bash
npm run dev              # Serveur local (HMR)
npm run build            # Build prod → dist/
npm run build:metiers    # Régénère public/metiers.json depuis le CSV
npm run test:e2e         # Cypress headless
npm run test:e2e:open    # Cypress interactif
```

---

## Déployer le backend (Apps Script)

1. Google Sheet → **Extensions → Apps Script**
2. Coller `scripts/Code.gs` + `scripts/SendEmailBrevo.gs`
3. **Project Settings → Script properties** → ajouter `BREVO_API_KEY`
4. **Déployer → Nouveau déploiement** → Application Web
   - Exécuter en tant que : Moi
   - Accès : Tout le monde
5. Copier l'URL `.../exec` → `VITE_LEADS_ENDPOINT`

---

## Déployer le frontend (Netlify)

1. Connecter le repo GitHub sur [app.netlify.com](https://app.netlify.com)
2. Build command : `npm run build` / Publish : `dist`
3. Ajouter `VITE_LEADS_ENDPOINT` + `VITE_GOOGLE_SHEETS_API_KEY` dans les variables d'environnement
4. Push sur `main` → redéploiement automatique

---

## Algorithme de scoring

```
score_métier = Σ(match_i × poids_i) / Σ(poids_i) × 100
```

- `match_i ∈ {0, 0.5, 1}` : correspondance réponse Qi ↔ attribut métier
- `poids_i` : colonne `Poids_Q1`…`Poids_Q8` de l'onglet Métiers (modifiables par Boris sans toucher au code)
- Les métiers sont groupés par thématique (`bloc`) → top 3 thématiques avec leurs meilleurs métiers

---

## Tests E2E

```bash
npm run test:e2e:open   # Cypress interactif (local)
npm run test:e2e        # Headless (CI)
```

8 scénarios dans `cypress/e2e/quiz.cy.js` : parcours complet, validation, RGPD, navigation,
email invalide, clavier, responsive 375px.

---

## Troubleshooting

| Problème | Solution |
|---|---|
| `npm install` échoue EBADF | Dossier sync cloud (Drive/OneDrive) — travailler depuis `C:\dev\` local |
| POST vers Apps Script silencieux | Vérifier `VITE_LEADS_ENDPOINT` = URL `.../exec`, mode no-cors, accès "Tout le monde" |
| Email ne part pas | `BREVO_API_KEY` dans Script Properties, logs Apps Script → Exécutions |
| Scoring bizarre | Onglet Métiers → vérifier `Poids_Q1`–`Poids_Q8` (format décimal, pas vide) |
| Clé Sheets refusée | Restreindre dans Google Cloud Console : HTTP referrers + API Sheets uniquement |

---

## V2 — Spec future (non implémenté)

Ce qui était prévu mais pas encore codé :

- **Admin dashboard** : Boris édite pondérations sans toucher au Sheet directement
- **Proxy serverless** : Netlify Function pour la clé Google Sheets (ne plus exposer `VITE_`)
- **Matching enrichi** : codes ROME (data.gouv) + pénuries sectorielles
- **Droit à l'oubli automatisé** (RGPD)
- **A/B testing** sur les questions
- **Multi-langue** (FR/EN)

---

## Contacts

- **Martine** (cheffe projet) : m.desmaroux@eisf.fr
- **Boris** (client OYA) : boris@oya.fr
