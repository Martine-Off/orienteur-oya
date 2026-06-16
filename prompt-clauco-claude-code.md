# Brief Claude Code — L'Orienteur OYA POC

**Adressé à** : Claucau (Claude Code)  
**Cheffe de projet** : Martine  
**Superviseur tech** : Claudie  
**Timeline** : 3 jours × 7h = 21 heures (17-23 juin 2026)  
**Livraison** : 23 juin, 17h

---

## ✅ TA MISSION — CONTEXTE COMPLET

Tu dois construire une **web app de quiz d'orientation métier** (React + Vite).

**Parcours utilisateur** :
1. Page d'accueil : présentation OYA + CTA "Démarrer le quiz"
2. Quiz : 8-10 questions fermées (choix multiples / cartes visuelles)
   - Ancien secteur d'activité, niveau d'études, région, ce qui attire, contraintes, temps disponible, budget, expérience agriculture
3. Validation côté client (pas de champs vides)
4. Page de résultats : classement des 3 métiers les mieux matchés avec scores (0-100), compétences clés, niveau de qualification
5. Avant d'afficher les résultats : capture email de l'utilisateur (REQUIS) + checkbox RGPD explicite (REQUIS)
6. À la soumission (POST JSON) : 
   - **(1) Enregistrer le lead** dans Google Sheet "Réponses" (date, email, Q1-Q10, top_3_métiers, scores, région, bloc, être_tenu_au_courant)
   - **(2) Envoyer un email de résultats** au candidat (Brevo) avec ses top 3 métiers + compétences + formations OYA
   - **(3) Optionnel futur : espace admin** pour que Boris édite les métiers/pondérations et consulte les leads (NOT IN POC)

**Valeur** : Boris valide la demande marché réelle (quels métiers, par région, par profil) AVANT de construire son catalogue de formations.

---

## 🏗️ ARCHITECTURE CLEF : ENDPOINT UNIQUE (CONFIGURABLE)

**C'EST LE POINT CRITIQUE.**

Tu NE dois PAS intégrer directement Google Sheets dans React. Au lieu de ça :

**React envoie un simple POST JSON vers un endpoint configurable** :

```javascript
// Dans React (.env)
VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercallback

// Dans React (api.js)
const submitLead = async (data) => {
  const response = await fetch(process.env.VITE_LEADS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",  // ⚠️ CRITIQUE : Google Apps Script ne gère pas CORS
    headers: {
      "Content-Type": "text/plain"  // ⚠️ CRITIQUE : pas "application/json"
    },
    body: JSON.stringify({
      email: data.email,
      Q1: data.Q1,
      // ... Q2-Q10
      top_3_métiers: ["métier1", "métier2", "métier3"],
      scores: [85, 72, 68],
      région: "Île-de-France",
      bloc: "Production agricole",
      être_tenu_au_courant: true
    })
  });
  
  // Réponse sera opaque (mode: no-cors)
  // Si pas d'erreur réseau → considère OK
  return !response.error;
};
```

**Pourquoi c'est important** :
- Martine peut **changer le backend sans toucher ton code**
- Jour 1 : Google Apps Script (gratuit)
- Demain : Webhook custom, Lambda, Supabase, etc
- **Zéro dépendance** au backend dans le code React

---

## ⚠️ SUBTILITÉ CRITIQUE : CORS + Google Apps Script

Google Apps Script **ne supporte PAS le CORS préflight**. Donc :

❌ **MAUVAIS** (échouera) :
```javascript
fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});
// → Préflight CORS fail → POST n'est jamais envoyé
```

✅ **BON** (marche) :
```javascript
fetch(endpoint, {
  method: "POST",
  mode: "no-cors",  // ← Pas de préflight
  headers: { "Content-Type": "text/plain" }  // ← Pas "application/json"
  body: JSON.stringify(data)  // ← Reste du JSON, juste le header change
});
```

**Côté Google Apps Script**, reçoit `text/plain` et parse JSON :
```javascript
function doPost(e) {
  // e.postData.contents = string JSON
  const data = JSON.parse(e.postData.contents);
  
  // Maintenant tu peux utiliser data.email, data.Q1, etc
  // ...
}
```

**Document this clearly** dans le README et les commentaires du code.

---

## 📋 SCOPE (IN ✅ / OUT ❌)

### IN — À LIVRER

**Frontend (React + Vite)**
- [ ] Page d'accueil : présentation OYA + CTA "Démarrer"
- [ ] Quiz : 8-10 questions fermées (choix multiples / cartes visuelles)
- [ ] Validation côté client (pas de champs vides, pas d'erreur silencieuse)
- [ ] Page résultats : afficher top 3 métiers avec scores (0-100), compétences clés, niveau qualification
- [ ] Formulaire email + RGPD : email requis + checkbox RGPD **requis** ("J'accepte de recevoir mon diagnostic et que mes réponses soient utilisées à titre statistique")
- [ ] Design conforme charte OYA (Martine te fournit couleurs hex, typos)

**Backend (Google Apps Script)**
- [ ] `doPost(e)` endpoint qui reçoit POST JSON depuis React
- [ ] Envoie email Brevo au candidat avec ses résultats
- [ ] Insère une ligne dans Google Sheet "Réponses" avec tous les data

**Data (Google Sheet)**
- [ ] Onglet "Métiers" : 87 métiers (Martine crée, tu popule à partir du CSV)
  - Colonnes : Métier, Bloc, Poids_Q1-Q8, Compétences_clés, Niveau_qualification
- [ ] Onglet "Réponses" : structure pour chaque lead (email, Q1-Q10, top_3, scores, région, bloc)
- [ ] Onglet "Analytics" : formules COUNTIF simples (nb par région, top métiers, distribution bloc)

**Tests**
- [ ] Parcours E2E complet : quiz → email reçu → ligne Sheet insérée
- [ ] Navigation clavier (Tab/Enter/Escape)
- [ ] Validation formulaire

**Déploiement**
- [ ] GitHub repo public (src, Apps Script code, tests, .env.example, README.md)
- [ ] Netlify déployé et fonctionnel
- [ ] CI/CD automatique (push GitHub → Netlify build + deploy)

**Documentation**
- [ ] README.md technique (français) : 
  - Résumé archi
  - Comment démarrer en local
  - Env vars (Brevo key, Sheet ID, Apps Script URL)
  - Comment déployer
  - Troubleshooting

### OUT — NE PAS FAIRE

- ❌ Admin dashboard React (V2)
- ❌ IA générative (scoring déterministe uniquement)
- ❌ Authentification utilisateur / login
- ❌ Multi-langue
- ❌ Perfectionism CSS / animations avancées
- ❌ Charts / graphs (formules brutes suffisent)
- ❌ TCDs automatiques (formules COUNTIF basiques)

---

## 🛠 STACK TECHNIQUE

| Couche | Tech | Config |
|---|---|---|
| **Frontend** | React 18 + Vite | `npm create vite@latest -- --template react` |
| **Backend** | Google Apps Script | Coller dans script.google.com |
| **Data** | Google Sheet | ID fourni par Martine |
| **Email** | Brevo API | API key fournie par Martine |
| **Deploy** | Netlify | CI/CD depuis GitHub |
| **Tests** | Cypress ou Playwright | E2E uniquement |

---

## 📝 FICHIERS D'ENTRÉE (Martine te donne)

1. **CSV_87_Metiers_OYA_V2_Niveau_MIN.csv** — 87 métiers + colonnes (Bloc, Compétences, etc)
2. **gherkin-flux-utilisateur-poc.md** — Étapes 1-8 du quiz (détaillé)
3. **gherkin-flux-backend-poc.md** — Flux Boris + structure Sheet
4. **schéma-architecture-miro.png** — Diagramme flux (référence visuelle)
5. **cahier-des-charges.md** — Scope officiel
6. **note-de-cadrage.md** — Risques, hypothèses, blockers
7. **charte-graphique-OYA.txt** — Couleurs hex, typos, logo

**Credentials (J0)** :
- Brevo API key + sender email
- Google Sheet ID + secret key
- GitHub token (si repo privé au départ)

---

## 🎯 CRITÈRES D'ACCEPTATION

### Fonctionnels ✅

- [ ] Quiz affiche 8-10 questions sans erreur
- [ ] Réponses validées côté client (pas de champs vides)
- [ ] Scoring calcule correctement : `score = Σ(réponse_i × poids_critère_i)`
- [ ] Top 3 métiers affichés avec : nom, bloc, score 0-100, compétences clés, niveau qualification
- [ ] Formulaire email : email requis + RGPD checkbox requis
- [ ] POST envoyé vers Apps Script sans erreur CORS
- [ ] Email Brevo reçu < 30s après soumission (avec résultats + logo)
- [ ] Ligne insérée dans Sheet "Réponses" immédiatement (date, email, Q1-Q10, top_3, scores, région, bloc)

### Non-fonctionnels ✅

- [ ] Navigation clavier complète (Tab, Enter, Escape)
- [ ] Contraste ≥ 4.5:1 partout (Lighthouse ≥ 90)
- [ ] Responsive (mobile 320px, tablet 768px, desktop 1440px)
- [ ] Compatible NVDA/JAWS (labels explicites, structure sémantique)
- [ ] Performance : Lighthouse Speed ≥ 80

### Code Quality ✅

- [ ] Code lisible, commenté sur les points clés
- [ ] Pas de console.error en prod
- [ ] Secrets pas commités (env vars dans .env)
- [ ] Tests E2E 5+ passants
- [ ] README complet

---

## 🚀 ARCHITECTURE DÉTAILLÉE

### Frontend (React)

```
src/
├── App.jsx                   # Router + layout principal
├── pages/
│   ├── Landing.jsx          # Page d'accueil
│   ├── Quiz.jsx             # Composant quiz (8-10 questions)
│   ├── Results.jsx          # Affichage top 3 métiers
│   └── EmailCapture.jsx     # Formulaire email + RGPD
├── components/
│   ├── Question.jsx         # Composant réutilisable question
│   ├── MetierCard.jsx       # Affichage un métier avec score
│   └── ProgressBar.jsx      # Barre progression quiz
├── hooks/
│   ├── useQuiz.js           # State quiz (Q1-Q10, scores)
│   └── useMetiers.js        # Fetch + cache métiers du Sheet
├── utils/
│   ├── api.js               # Appel POST vers VITE_LEADS_ENDPOINT (endpoint configurable)
│   ├── scoring.js           # Logique de scoring (PURE, testable)
│   └── validation.js        # Validation email, regex
├── styles/
│   └── App.css              # Conforme WCAG (contraste, typos)
└── vite.config.js           # Config Vite

.env.example:
  # Endpoint configurable — peut être Google Apps Script, Webhook, Supabase, etc
  VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/YOUR_ID/usercallback
  
  # Optionnel (pour Supabase futur)
  # VITE_SUPABASE_URL=https://xxx.supabase.co
  # VITE_SUPABASE_KEY=eyxxx
```

**Architecture endpoint configurable** :
- `api.js` = **unique point d'intégration backend**
- POST JSON vers `VITE_LEADS_ENDPOINT` (configurable via .env)
- Mode no-cors, Content-Type: text/plain (pour Google Apps Script)
- Martine peut changer le backend sans toucher le code React

**Points clés** :
- Métiers **fetchés une seule fois au mount**, pas à chaque question (performance)
- Scoring **séparé en fonction pure** (`scoring.js`) pour être auditable
- **No-CORS mode** pour POST vers Apps Script (Content-Type: text/plain)
- **Validation côté client seulement** jusqu'à submit final

---

### Backend (Google Apps Script)

**Tu dois générer le script Apps Script complet.**

```javascript
// script.google.com — Coller ce code tel quel

function doPost(e) {
  try {
    // Parse JSON depuis React (Content-Type: text/plain)
    const data = JSON.parse(e.postData.contents);

    // Validation basique
    if (!data.email || !data.Q1) {
      return ContentService.createTextOutput("Invalid data").setMimeType(ContentService.MimeType.TEXT);
    }

    // (1) Insère ligne dans Google Sheet "Réponses"
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Réponses");
    sheet.appendRow([
      new Date(),
      data.email,
      data.Q1, data.Q2, data.Q3, data.Q4, data.Q5, data.Q6, data.Q7, data.Q8,
      data.top_3_métiers[0], data.top_3_métiers[1], data.top_3_métiers[2],
      data.scores[0], data.scores[1], data.scores[2],
      data.région, data.bloc, data.être_tenu_au_courant
    ]);

    // (2) Envoie email Brevo avec résultats
    sendEmailBrevo(data.email, data.top_3_métiers, data.scores);

    // Retour (réponse opaque, mais succès)
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput("Error").setMimeType(ContentService.MimeType.TEXT);
  }
}

function sendEmailBrevo(email, métiers, scores) {
  // Récupère API key depuis les propriétés du script
  const brevoKey = PropertiesService.getScriptProperties().getProperty("BREVO_API_KEY");
  const brevoUrl = "https://api.brevo.com/v3/smtp/email";

  const payload = {
    to: [{email: email}],
    sender: {email: "hello@oya.fr", name: "OYA L'Orienteur"},
    subject: "Votre diagnostic L'Orienteur OYA",
    htmlContent: `
      <h2>Votre diagnostic d'orientation</h2>
      <p>Voici les 3 métiers correspondant à votre profil :</p>
      <ol>
        <li><strong>${métiers[0]}</strong> - Score: ${scores[0]}/100</li>
        <li><strong>${métiers[1]}</strong> - Score: ${scores[1]}/100</li>
        <li><strong>${métiers[2]}</strong> - Score: ${scores[2]}/100</li>
      </ol>
      <p>Découvrez les formations correspondantes sur <a href="https://oya.fr">oya.fr</a></p>
      <p>À bientôt!</p>
      <p><small>Vous recevez cet email car vous avez accepté de recevoir votre diagnostic et que vos réponses soient utilisées à titre statistique (RGPD).</small></p>
    `
  };

  const options = {
    method: "post",
    headers: {
      "api-key": brevoKey,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(brevoUrl, options);
  const result = JSON.parse(response.getContentText());

  if (response.getResponseCode() !== 201) {
    Logger.log("Brevo error: " + response.getResponseCode() + " - " + result);
  }
}

// À faire manuellement (ou via script) :
// 1. Crée le Google Sheet avec onglets "Métiers", "Réponses", "Analytics"
// 2. Dans Apps Script : Project Settings → add environment variable BREVO_API_KEY = ta clé
// 3. Deploy as Web App (Execute as: your account, Who has access: Anyone)
// 4. Copie l'URL de déploiement → VITE_LEADS_ENDPOINT en React
```

**Important** :
- Tu dois générer ce code et l'inclure dans le README ou un fichier `/google-apps-script/Code.gs`
- Instructions claires : "Coller ce code dans script.google.com, puis déployer comme Web App"
- Documenter le setup : où mettre BREVO_API_KEY, comment obtenir l'URL de déploiement

---

### Data (Google Sheet)

**Onglet "Métiers"** (structure pré-remplie par Martine) :

| Métier | Bloc | Poids_Q1 | Poids_Q2 | ... | Compétences_clés | Niveau |
|---|---|---|---|---|---|---|
| Maraîcher bio | Production | 0.8 | 0.6 | ... | Agroécologie, gestion sol | Bac |
| Logisticien agro | Distribution | 0.5 | 0.7 | ... | Planification, IT | Bac+2 |

**Onglet "Réponses"** (auto-peuplé par Apps Script) :

| date_heure | email | Q1 | Q2 | ... | top_1_métier | score_1 | région | bloc | être_tenu_au_courant |
|---|---|---|---|---|---|---|---|---|---|
| 2026-06-17 10:30 | user@ex.com | Services | Bac | ... | Maraîcher bio | 85 | IDF | Production | TRUE |

**Onglet "Analytics"** (formules pré-construites) :

```
=COUNTIF(Réponses!Q:Q, "Île-de-France")  // Nb diagnostics par région
=COUNTIF(Réponses!K:K, "Maraîcher bio")  // Top métiers
=COUNTIF(Réponses!R:R, "Production")     // Distribution blocs
```

---

## 🧪 TESTS

**Parcours E2E** (Cypress) :

```javascript
// cypress/e2e/quiz.cy.js
describe("Quiz complet", () => {
  it("doit compléter le quiz et envoyer les données", () => {
    cy.visit("/");
    cy.contains("Démarrer").click();
    
    // Q1
    cy.get("label").contains("Services").click();
    cy.contains("Suivant").click();
    
    // Q2-Q8... (idem)
    
    // Résultats
    cy.contains("Top 3 métiers").should("be.visible");
    cy.contains("Maraîcher").should("exist");
    
    // Email
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='checkbox']").click(); // RGPD
    cy.contains("Envoyer").click();
    
    // Confirmation
    cy.contains("Merci!").should("be.visible");
  });
});
```

**Validation** :
- [ ] Quiz affiche correctement
- [ ] Scoring calcule (vérifier scores retournés)
- [ ] Email reçu (vérifier inbox Brevo)
- [ ] Ligne Sheet (ouvrir Sheet, voir nouvelle ligne)

---

## ⚠️ PIÈGES À ÉVITER

1. **CORS** : Google Apps Script + React = no-cors mode requis. Sinon POST échoue.
   → Utilise `mode: 'no-cors'` + `Content-Type: 'text/plain'` dans fetch React

2. **Métiers slow** : Fetcher 87 métiers à chaque question = latence.
   → Fetch une seule fois au mount, cache en state React

3. **Feature creep** : "On ajoute admin dashboard?" → NON. Scope = MVP.
   → Claudie va te challenger. Say no.

4. **Perfectionism CSS** : Les couleurs OYA peuvent être approximatives.
   → Itérer en V2. Focus sur le quiz.

5. **Tests manuels seulement** : E2E = indispensable.
   → Cypress/Playwright dès J2

---

## 📞 COMMUNICATION

**Kick-off** (J0, fin) : 1h avec Martine + Claudie
- Questions d'archi?
- Credentials OK?
- GitHub repo créé?

**Sync daily** (fin de journée J1-J2) :
- Claudie review le code (30min)
- Blockers? Claudie débloque.

**Validation finale** (J3, 17h) :
- Tests passants?
- GitHub clean?
- README fini?
- → LIVRÉ

---

## 🎁 LIVRABLES

**23 juin, 17h** :

```
📦 L'Orienteur OYA POC
├── GitHub public (https://github.com/martine/orienteur-oya)
│   ├── src/ (React app)
│   ├── google-apps-script/ (code Apps Script)
│   ├── cypress/ (tests E2E)
│   ├── .env.example
│   ├── README.md (français)
│   └── package.json
├── Netlify deployed (https://orienteur-oya.netlify.app)
├── Google Sheet (ID partagée avec jury)
└── Tests passants (5+ E2E ✅)
```

---

## 🚀 GO!

**Questions avant de démarrer?** → Ask Claudie

**Des blockers pendant?** → Slack Claudie immédiatement

**Bon dev!** 💪

---

**Signé** :
- Martine (cheffe de projet)
- Claudie (superviseur tech)
