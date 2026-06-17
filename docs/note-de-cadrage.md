# Note de cadrage — POC L'Orienteur OYA

**Date** : 16 juin 2026  
**Période** : 16-23 juin 2026 (7 jours calendaires, 21h de travail)  
**Audience** : Claucau (dev), Claudie (superviseur tech), Martine (cheffe de projet)

---

## 1. Contexte et objectifs

### Contexte
OYA est une EdTech naissante focalisée sur la transition alimentaire. Boris (fondateur) a besoin de valider la demande marché AVANT de construire son catalogue de formations. L'enjeu : identifier rapidement quel métier/région/profil demande une formation, pour prioriser les lancements.

### Objectifs du POC
1. **Valider le concept** : Un quiz simple peut-il trier les candidats et les matcher aux métiers?
2. **Collecter des leads** : Capture qualifiée d'emails pour Boris
3. **Analyser les patterns** : Boris voit les données agregées (région, métier, profil)

### Succès
- App déployée et fonctionnelle 23 juin
- 5+ tests E2E passants
- Boris peut voir les 10 premiers diagnostics dans le Sheet
- Email Brevo livré à l'utilisateur < 30s

---

## 2. Hypothèses clés (VALIDÉES ✅)

| Hypothèse | Statut | Evidence |
|---|---|---|
| 87 métiers OYA déjà structurés (CSV) | ✅ CONFIRMÉE | CSV_87_Metiers_OYA_V2_Niveau_MIN.csv existe |
| Scoring déterministe suffit (pas d'IA générative) | ✅ VALIDÉE | PARTIE 1 du dossier, arbitrage stratégique |
| Google Sheet acceptable comme DB POC | ✅ CONFIRMÉE | Cols Verts l'utilise déjà, UE, RGPD |
| Brevo API disponible et stable | ✅ CONFIRMÉE | Service français, 300/jour gratuit |
| 21h suffisent pour le POC | ✅ À VALIDER | Timeline détaillée en cahier des charges |

**Si une hypothèse s'effondre** : Claudie/Martine arbitre immédiatement.

---

## 3. Dépendances

### Externes (hors contrôle)
- **Google Sheets API** : Risque très bas (Google = ultra-stable)
- **Brevo API** : Risque bas (service français, bien documenté, support dispo)
- **Netlify** : Risque très bas (standard industrie)
- **GitHub** : Risque très bas (standard industrie)

### Internes (contrôle Martine)
- Brevo credentials (API key) doit être prête J0 ⚠️
- Charte OYA (couleurs, typos) doit être fournie à Claucau J0 ⚠️
- Google Sheet structure doit être confirmée J0 ⚠️

---

## 4. Blockers potentiels et solutions

| Blocker | Symptôme | Solution |
|---|---|---|
| Brevo API key pas prête | Claucau attendu Martine | Passer credential J0 midi ou utiliser compte test Martine |
| CORS Google Apps Script bloque POST | POST vers Apps Script échoue | Mode no-cors + Content-Type: text/plain (documenté) |
| Sheet ID pas connue | Apps Script ne sait pas où insérer | Martine crée Sheet J0 et partage ID |
| Performance : 87 métiers slow | Quiz > 5s à charger | Cache métiers au mount React, fetch une seule fois |
| Tests E2E : pas vrai Brevo | Tests mocké ne valident pas réel | Mettre 1 vraie flow E2E avec credentials réels |
| Charte OYA incomplète | Design dillaté | Utiliser couleurs de base (bleu/orange/blanc) et affiner V2 |

**Escalade rapide** : Si blocker J1, Martine appelle Claudie immédiatement.

---

## 5. Risques identifiés

### 🔴 Risque 1 : Timeline insuffisante (21h)

**Probabilité** : Moyenne 🟡  
**Impact** : Livraison retardée, démo annulée

**Symptômes** :
- Claucau ralenti par setup (GitHub, Netlify, Brevo)
- Feature creep (admin React, TCDs auto)
- Perfectionism CSS

**Mitigation** :
- Claudie supervise et challenge la scope
- Martine arbitre immédiatement si scope glisse
- MVP uniquement : quiz → email → Sheet
- Design basique (itération visuelle V2)

---

### 🔴 Risque 2 : Intégration Apps Script-React bloquante

**Probabilité** : Basse 🟢  
**Impact** : Bloquant (rien ne marche sans ça)

**Symptômes** :
- CORS erreurs sur POST
- Apps Script reçoit rien

**Mitigation** :
- Documenté dans cahier des charges (mode no-cors + text/plain)
- Claucau teste immédiatement J1 avec un curl simple
- Claudie revue le code d'intégration J1 fin

---

### 🔴 Risque 3 : Brevo API instable ou credentials expirés

**Probabilité** : Très basse 🟢  
**Impact** : Bloquant (email ne part pas)

**Symptômes** :
- Erreur 401 / 403 Brevo
- Email n'arrive jamais

**Mitigation** :
- Martine teste Brevo API avant J0 (curl/Postman)
- Claucau utilise un compte Brevo de test J1
- Fallback : test avec sendgrid gratuit si Brevo inaccessible

---

### 🟡 Risque 4 : Performance Google Sheet (87 métiers slow)

**Probabilité** : Basse 🟢  
**Impact** : Latence > 5s au chargement

**Symptômes** :
- Quiz affichage ralenti
- Utilisateur abandonne

**Mitigation** :
- Charger métiers au mount React (fetch une seule fois)
- Cache localStorage si possible
- Lighthouse Performance test J2

---

### 🟡 Risque 5 : Feature creep (admin React, analytics auto, etc)

**Probabilité** : Moyenne 🟡  
**Impact** : Timeline glisse de 1-2 jours

**Symptômes** :
- Claucau demande "on ajoute admin dashboard?"
- Martine hésite

**Mitigation** :
- Claudie challenge immédiatement
- Cahier des charges clair : "Scope OUT = admin React"
- Martine arbitre : MVP ou pas
- Garder todo list pour V2

---

## 6. Contraintes clés

### Technique
- CORS : Google Apps Script + mode no-cors
- Métiers : 87 max, pondérations dans Sheet
- Email : Brevo API uniquement (pas SendGrid)
- Deploy : Netlify, pas Vercel

### Légale (RGPD)
- Consentement explicite requis (article 7)
- Pas de cookies tiers
- Données UE uniquement
- Pas de Google Analytics

### Opérationnelle
- Martine supervise Claucau (pas de code commité sans review)
- Claudie valide les décisions arch
- Boris pas impliqué dans le POC (focus délivery)

---

## 7. Décisions architecturales clés

| Décision | Raison | Alternative rejetée | Trade-off |
|---|---|---|---|
| React + Vite | Déploiement rapide, code transparent | Vue/Svelte | Dépend de npm ecosys |
| Google Apps Script | Un appel = email + Sheet, gratuit | Netlify Functions | Pas NodeJS nécessaire |
| Google Sheet | Source unique de vérité, Boris modifie | Supabase/Firebase | Complexité cloud, coûts |
| Brevo | Français, RGPD, gratuit 300/jour | SendGrid, Mailgun | Meilleure conformité EU |
| Scoring déterministe | Frugalité, clarté, pas d'IA | Claude API générative | Empreinte carbone basse |

**Aucune décision n'est permanente** : V2 peut pivoter si données le justifient.

---

## 8. Métriques de succès

**Delivery**
- ✅ Repository public live
- ✅ Netlify déployé sans erreur
- ✅ Tests E2E 5+ passants
- ✅ README complet

**Qualité**
- ✅ Lighthouse Accessibility ≥ 90
- ✅ RGPD checkbox visible et requis
- ✅ Email reçu < 30s
- ✅ Ligne Sheet insérée instantanément

**User Experience**
- ✅ Quiz < 5 minutes
- ✅ Navigation clavier fonctionnelle
- ✅ Design conforme charte OYA
- ✅ Pas de console.error

---

## 9. Communication et escalade

### Rhythme
- **J0 fin** : Kick-off 1h (Martine + Claucau + Claudie)
- **J1 fin** : Sync 30min (Martine + Claudie, Claucau optionnel)
- **J2 fin** : Sync 30min (Martine + Claudie, Claucau optionnel)
- **J3 fin** : Validation finale 1h (tous)

### Escalade
- **Blocker technique** → Claudie intervient immédiatement
- **Scope creep** → Martine arbitre
- **Credentials manquantes** → Martine confirme J0
- **Deadline risque** → Claudie + Martine pivot scope

### Channels
- Slack : synchrone, urgence
- Email : asynchrone, documentation
- Meeting : décisions, escalade

---

## 10. Post-POC (hors scope)

Si POC livré 23 juin, V2 peut inclure :

**Core V2** :
- Admin dashboard React (Boris modifie métiers, pondérations, TCDs via UI)
- TCDs auto (formules Google Sheets + charts interactifs)
- Droit à l'oubli automatisé
- Export Excel pour collectivités
- A/B testing des questions

**Optionnel V2 — Enrichissement data.gouv** :
- Mapper les 87 métiers OYA → codes ROME (Referentiel Opérationnel des Métiers)
- Intégrer données "métiers en tension" (data.gouv : pénuries de candidats par secteur)
- Pondérations enrichies : si utilisateur vient de secteur X, bonus score vers métiers ROME connexes
- Afficher contraintes officielles (pénibilité, horaires, etc) via data.gouv

**Pas avant le 26 juin. À mentionner dans l'oral jury (21 sept).**

---

## 11. Sign-off

| Rôle | Nom | Status |
|---|---|---|
| **Dev** | Claucau (Claude Code) | ✅ Compris le cahier des charges |
| **Superviseur tech** | Claudie (moi, collègue tech) | ✅ Prêt à superviser |
| **Cheffe projet** | Martine | ✅ Valide le scope |

**Date de démarrage** : 17 juin 2026, 9h  
**Deadline livraison** : 23 juin 2026, 17h

🚀 **C'est parti!**
