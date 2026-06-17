# Cahier des charges — POC L'Orienteur OYA

**Projet** : L'Orienteur OYA — Web app de quiz d'orientation métier  
**Client** : Boris Marcel (OYA)  
**Cheffe de Projet** : Martine  
**Dev** : Claude Code (Claucau)  
**Supervision tech** : Claudie  
**Timeline** : 3 jours × 7h = 21 heures  
**Livraison** : 23 juin 2026, 17h

---

## 1. Objectif

Construire une web app de quiz d'orientation qui :
- Pose 8-10 questions fermées au candidat
- Recommande les 3 métiers correspondants à son profil
- Capture son email avec consentement RGPD explicite
- Enregistre les données pour que Boris analyse la demande marché

**Valeur** : Validation de marché qualifiée. Boris sait exactement quel métier/région/profil demande une formation.

---

## 2. Scope

### IN ✅

**Frontend (React + Vite)**
- Page d'accueil : présentation + CTA
- Quiz : 8-10 questions fermées (choix multiples / cartes visuelles)
- Validation côté client (pas de champs vides)
- Page résultats : top 3 métiers (score, compétences clés)
- Formulaire email : email requis + checkbox RGPD requis
- Design conforme charte OYA

**Backend (Google Apps Script)**
- Reçoit POST JSON depuis React
- Envoie email Brevo au candidat avec ses résultats
- Insère une ligne dans Google Sheet "Réponses"

**Data (Google Sheet)**
- Onglet "Métiers" : 87 métiers + pondérations (modifiable par Boris sans code)
- Onglet "Réponses" : chaque lead (email, Q1-Q10, top_3, scores, région, bloc)
- Onglet "Analytics" : TCDs pré-construits (nb par région, top métiers, distribution bloc)

**Tests**
- Parcours E2E complet : quiz → email reçu → ligne Sheet
- Navigation clavier fonctionnelle
- Formulaire validation

**Déploiement**
- GitHub repo public (React + Apps Script code)
- Netlify déployé et fonctionnel
- CI/CD automatique (push GitHub → Netlify deploy)

**Documentation**
- README.md technique (français) : stack, installation, env vars, déploiement, maintenance

### OUT ❌

- Admin dashboard React (V2)
- IA générative (scoring déterministe uniquement)
- Authentification utilisateur
- Multi-langue
- Perfectionism CSS/animations
- Machine learning / recommandations adaptatives
- Export PDF / rapports
- Historique utilisateur / login

---

## 3. Contraintes

### RGPD
- Consentement explicite AVANT collecte (checkbox requis)
- Libellé clair : "J'accepte de recevoir mon diagnostic et que mes réponses soient utilisées à titre statistique" (article 7 RGPD)
- Email seule donnée identifiante
- Pas de cookies tiers, pas de Google Analytics
- Données stockées UE (Google Sheet UE)

### Accessibilité
- WCAG 2.1 AA minimum
- Navigation clavier complète (Tab/Enter/Escape)
- Contraste texte/background ≥ 4.5:1
- Labels explicites sur tous champs
- Compatible lecteurs d'écran (NVDA, JAWS)
- Responsive (mobile/tablet/desktop)

### Frugalité
- **Coût infra** : 0€ (React gratuit, Apps Script gratuit, Brevo 300/jour gratuit, Netlify gratuit)
- **Empreinte carbone** : Pas d'IA générative (logique déterministe)
- **Dépendances externes** : Minimales (Brevo API seule vraie dépendance)

### Souveraineté
- Services français/EU uniquement (Brevo, Google, Netlify)
- Code open source possible (GitHub public)
- Pas de vendor lock-in

### Autonomie
- Boris peut modifier les pondérations dans le Sheet **sans toucher au code**
- Structure métiers claire et maintenable

---

## 4. Stack technique

| Couche | Technologie | Justification |
|---|---|---|
| **Frontend** | React 18 + Vite | Scoring transparent, déploiement rapide, WCAG 2.1 AA possible |
| **Backend** | Google Apps Script | Email + insert Sheet en un appel, gratuit, simple, auditable |
| **Data** | Google Sheet | Source unique de vérité, modifiable par Boris, UE, RGPD |
| **Email** | Brevo API | Service français (Nantes), 300/jour gratuit, RGPD strict |
| **Deploy** | GitHub + Netlify | CI/CD auto, public, gratuit, standard industrie |

---

## 5. Livrables attendus (23 juin, 17h)

- [ ] **Repository GitHub public** avec :
  - `/src` : code React complet + Vite config
  - `/google-apps-script` : code Apps Script prêt à coller dans script.google.com
  - `/tests` : tests E2E (Cypress ou similaire)
  - `.env.example` : variables d'env requises
  - `README.md` technique (français)

- [ ] **Lien Netlify déployé** : https://orienteur-oya.netlify.app (ou similaire)
  - Formulaire quiz fonctionnel
  - Scoring fonctionne
  - Email Brevo envoyé après soumission

- [ ] **Template Google Sheet** : structure prête
  - Onglet "Métiers" : 87 métiers organisés
  - Onglet "Réponses" : colonne pour chaque Q + résultats
  - Onglet "Analytics" : formules TCDs basiques

- [ ] **Tests E2E passants** :
  - Parcours complet : quiz → validation → email → Sheet
  - Navigation clavier
  - RGPD checkbox requis

- [ ] **README.md** (français) :
  - Résumé archi
  - Comment démarrer en local
  - Variables d'env (Brevo key, Sheet ID, Apps Script URL)
  - Comment déployer
  - Troubleshooting

---

## 6. Critères d'acceptation

**Fonctionnels**
- ✅ Quiz affiche 8-10 questions sans erreur
- ✅ Réponses validées côté client
- ✅ Scoring calcule correctement (auditable)
- ✅ Top 3 métiers affichés avec scores + compétences
- ✅ Formulaire email : email requis + RGPD checkbox requis
- ✅ POST envoyé vers Apps Script sans erreur CORS
- ✅ Email Brevo reçu < 30s après soumission
- ✅ Ligne insérée dans Sheet "Réponses" immédiatement

**Non-fonctionnels**
- ✅ Navigation clavier complète (Tab/Enter/Escape)
- ✅ Contraste ≥ 4.5:1 partout
- ✅ Compatible NVDA/JAWS
- ✅ **100% Responsive (mobile/tablet/desktop)** :
  - Mobile : ≤ 480px (quiz lisible, boutons touchables, pas de scroll horizontal)
  - Tablet : 481px-1024px (layout adapté, cartes visibles, formulaire confortable)
  - Desktop : > 1024px (layout optimal, colonnes, spacing)
- ✅ Lighthouse Accessibility ≥ 90
- ✅ Lighthouse Performance ≥ 75

**Code quality**
- ✅ Code lisible et commenté
- ✅ README complet
- ✅ Tests E2E passants
- ✅ Pas de console.error en prod
- ✅ Secrets pas commités (env vars)

---

## 7. Risques et mitigations

| Risque | Proba | Impact | Mitigation |
|---|---|---|---|
| Brevo API key pas prête | 🟡 Moyenne | Bloquant (J2) | Passer credential J0, tester immédiatement |
| CORS Google Apps Script | 🟢 Basse | Bloquant | Mode no-cors + Content-Type: text/plain |
| Performance Sheet (87 métiers) | 🟢 Basse | Latence > 5s | Charger métiers au mount, cache côté client |
| Tests E2E impossibles (pas vrai Brevo) | 🟡 Moyenne | Non-bloquant | Mock Brevo en dev, test réel avec credentials |
| Feature creep (admin React, etc) | 🟡 Moyenne | Dépass timeline | Claudie challenge, Martine arbitre |

---

## 8. Dépendances externes

- **Google Sheets API** : Google maintient, ultra-stable ✅
- **Brevo API** : Service français, stable, bien documenté ✅
- **Netlify** : Standard industrie, zéro risque ✅

---

## 9. Questions pré-démarrage

- [ ] Brevo API credentials prêts? (API key, sender email)
- [ ] Charte OYA fournie à Claucau? (couleurs hex, typos, logo)
- [ ] Google Sheet déjà créée ou Claude Code crée?
- [ ] Accès GitHub repo pour Claucau?
- [ ] Qui gère le déploiement Netlify (Martine ou Claucau)?

---

## 10. Timeline détaillée

**J1 (7h)**
- 9h-11h : Setup GitHub, Netlify, Brevo test
- 11h-14h : React app structure + quiz component
- 14h-17h : Google Apps Script + intégration email

**J2 (7h)**
- 9h-12h : Validation, scoring, résultats page
- 12h-14h : RGPD form + formulaire email
- 14h-17h : Tests E2E, polish UI

**J3 (7h)**
- 9h-11h : Bug fixes, edge cases
- 11h-14h : Documentation + README
- 14h-17h : Déploiement Netlify + validation finale

---

## 11. Signing off

**Claucau** : Je comprends le scope et les livrables  
**Claudie** : Je supervise et débloque  
**Martine** : Je coordonne et valide avec Boris

🚀 **GO!**
