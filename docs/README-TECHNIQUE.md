# L'Orienteur OYA — README technique

POC de quiz d'orientation métier. Un candidat répond à 9 questions fermées,
obtient ses 3 métiers les mieux assortis (parmi les métiers OYA) avec un
score 0-100, puis peut recevoir ce diagnostic par email en acceptant le
consentement RGPD. Chaque soumission est enregistrée dans un Google Sheet
pour analyse par Boris (OYA).

## 1. Architecture

```
React (Vite) ──POST JSON (no-cors)──▶ Google Apps Script (doPost)
                                          ├─▶ Google Sheet "Réponses" (insert ligne)
                                          └─▶ Brevo API (email diagnostic)
```

- **Frontend** : React 18 + Vite, routage avec `react-router-dom`.
- **Données métiers** : `public/metiers.json`, généré depuis le CSV des
  métiers OYA (`scripts/build-metiers.cjs`). Chargé une seule fois au
  montage de la page Résultats (`src/hooks/useMetiers.js`), pas de refetch
  par question.
- **Scoring** : fonction pure et auditable dans `src/utils/scoring.js`
  (aucune dépendance React). Voir section 4.
- **Backend** : Google Apps Script (`google-apps-script/Code.gs`), reçoit le
  POST, insère une ligne dans l'onglet "Réponses" et envoie l'email Brevo.
- **Intégration backend configurable** : `src/utils/api.js` est le SEUL
  point d'appel réseau vers le backend. L'URL vient de `VITE_LEADS_ENDPOINT`
  (`.env`) — changer de backend ne nécessite aucune modification de code
  React.

### CORS + Google Apps Script

Apps Script ne gère pas le préflight CORS. `api.js` envoie donc le POST en
`mode: "no-cors"` avec `Content-Type: "text/plain"` (le corps reste du JSON
classique). Conséquence : la réponse est opaque côté React — on ne peut pas
lire son statut. L'absence d'erreur réseau est considérée comme un succès.
C'est une limite connue et acceptée du POC.

## 2. Démarrer en local

```bash
npm install
npm run dev
```

L'app tourne sur http://localhost:5173. Sans `VITE_LEADS_ENDPOINT` configuré,
le quiz et le scoring fonctionnent normalement ; seul l'envoi final (email +
Sheet) échouera silencieusement (mode no-cors).

## 3. Variables d'environnement

Copier `.env.example` en `.env` (jamais commité) :

```
VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXXX/exec
```

Cette URL est obtenue après déploiement du Google Apps Script (section 5).

## 4. Scoring — comment ça marche

Formule : `score_métier = Σ(match_i × poids_i) / Σ(poids_i) × 100`

- `poids_i` : importance de la question i pour CE métier. Vit dans le Sheet,
  onglet "Métiers" (colonnes `Poids_Q1`...`Poids_Q8`), modifiable par Boris
  **sans toucher au code**. Valeurs par défaut générées dans
  `scripts/build-metiers.cjs` (identiques pour tous les métiers au démarrage
  du POC, faute de données différenciées dans le CSV source).
- `match_i` : degré de correspondance (0, 0.5 ou 1) entre la réponse de
  l'utilisateur et l'attribut du métier, calculé dans `src/utils/scoring.js`.
  Auditable : chaque question a sa fonction `matchQX` dédiée.

Mapping question → attribut métier (CSV `CSV_87_Metiers_OYA_V2_Niveau_MIN.csv`,
76 lignes — voir note en section 7) :

| Question | Attribut métier | Poids par défaut |
|---|---|---|
| Q1 secteur d'origine | `Type activité` | 0.8 |
| Q2 niveau d'études | `Niveau_MIN` | 0.6 |
| Q3 cadre de vie | `Localisation` | 0.7 |
| Q4 ce qui attire | `Type activité` + `Relation vivant` | 0.9 |
| Q5 contraintes physiques | pénibilité de `Type activité` | 0.5 |
| Q6 temps disponible | — (informatif, analytics uniquement) | 0 |
| Q7 budget | `Situation` | 0.6 |
| Q8 expérience agriculture | `Bloc` / `Statut` | 0.8 |
| Q9 région | — (informatif, analytics uniquement) | — |

Si les résultats du quiz semblent incohérents en test, ajuster les poids
dans le Sheet ou les fonctions `matchQX` — c'est un point d'itération
attendu et documenté dès le départ.

## 5. Déployer le backend (Google Apps Script)

1. Ouvrir le Google Sheet du projet (structure en section 6).
2. Extensions > Apps Script.
3. Coller le contenu de `google-apps-script/Code.gs`.
4. Project Settings > Script properties > ajouter `BREVO_API_KEY`.
5. Déployer > Nouveau déploiement > Type "Application Web" :
   - Exécuter en tant que : Moi
   - Qui a accès : Tout le monde
6. Copier l'URL de déploiement (`.../exec`) dans `VITE_LEADS_ENDPOINT`.

## 6. Structure du Google Sheet

Trois onglets : `Métiers`, `Réponses`, `Analytics`.

Les CSV prêts à importer/copier-coller sont dans
`google-apps-script/sheet-templates/` (régénérés par
`npm run build:metiers` puis `node scripts/build-sheet-templates.cjs`).

- **Métiers** : source de vérité. Colonnes `Poids_Q1`...`Poids_Q8`
  modifiables par Boris sans toucher au code. Si Boris modifie cet onglet,
  exporter en CSV, remplacer `CSV_87_Metiers_OYA_V2_Niveau_MIN.csv`,
  relancer `npm run build:metiers`, redéployer.
- **Réponses** : une ligne par lead (date, email, Q1-Q9, top 3 métiers,
  scores, région, bloc, consentement marketing). Remplie par
  `Code.gs::appendReponse`.
- **Analytics** : formules `COUNTIF` simples (par région, par métier, par
  bloc). Pas de TCD/chart automatisé (hors scope POC).

## 7. Notes sur les données

- Le CSV fourni contient **76 métiers**, pas 87 comme indiqué dans le
  cahier des charges initial. Le code s'adapte dynamiquement au nombre de
  lignes ; ce n'est pas bloquant.
- Le CSV ne contient pas de colonnes "Compétences_clés" : les compétences
  affichées viennent du champ `Intentions clés`, découpé sur les tirets.

## 8. Tests E2E

```bash
npm run test:e2e:open   # mode interactif
npm run test:e2e        # mode headless (CI)
```

8 scénarios dans `cypress/e2e/quiz.cy.js` : parcours complet, validation
côté client, progression, consentement RGPD requis, validation email,
navigation arrière, accessibilité clavier, responsive mobile.

## 9. Accessibilité & responsive

- Composants `Question` basés sur des `<input type="radio">` /
  `<select>` natifs (focus, lecteurs d'écran, navigation clavier sans JS
  supplémentaire).
- `Escape` dans le quiz ouvre une confirmation de sortie.
- Couleurs : palette extraite du logo OYA, ajustée pour un contraste
  texte/fond ≥ 4.5:1 (charte officielle non fournie au démarrage du POC —
  à remplacer si Boris la transmet).
- Layout fluide testé à 375px (mobile), 768px (tablette), 1440px (desktop).

## 10. Troubleshooting

### `npm install` échoue avec `EBADF` / `ENOTEMPTY`

Le dossier projet est synchronisé par un client cloud (Google Drive,
OneDrive...) qui verrouille des fichiers de `node_modules` pendant
l'installation. **Travailler depuis un chemin local non synchronisé**
(ex: `C:\dev\orienteur-oya`), jamais directement depuis un dossier Drive.

### `npm install cypress` (ou `playwright install`) échoue avec
`unable to verify the first certificate`

Signe d'un proxy d'entreprise qui inspecte le TLS. Contournement pour
l'installation locale uniquement (jamais en CI, jamais dans le code) :

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install -D cypress
```

En CI (Netlify, GitHub Actions), ce problème ne se pose pas.

### Cypress : `Cypress.exe: bad option: --smoke-test`

Rencontré en environnement de développement Windows avec un outil de
sécurité d'entreprise qui altère les arguments passés au binaire Cypress.
Le binaire téléchargé est valide (taille normale, PE32+ correct) ; le
souci est propre à la machine locale, pas au code du projet. Les tests
E2E sont écrits et prêts (`cypress/e2e/quiz.cy.js`) ; les exécuter en CI
si ce blocage persiste en local.

### Le POST vers Apps Script ne fait rien

Vérifier que `VITE_LEADS_ENDPOINT` est bien l'URL `.../exec` (pas `/dev`),
que le déploiement Apps Script est "Qui a accès : Tout le monde", et que
`mode: "no-cors"` + `Content-Type: "text/plain"` sont bien utilisés (sinon
le préflight CORS bloque silencieusement la requête).
