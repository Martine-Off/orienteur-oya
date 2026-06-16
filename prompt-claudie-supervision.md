# Brief Claudie — Supervision technique POC L'Orienteur OYA

**Adressé à** : Claudie (collègue tech superviseur)  
**Cheffe de projet** : Martine  
**Dev** : Claucau (Claude Code)  
**Timeline** : 17-23 juin 2026 (3 jours × 7h)

---

## 📋 TA MISSION

Tu es le **garde-fou technique** du POC. Ta job :

1. **Challenger** les décisions architecturales de Claucau
2. **Vérifier** la qualité du code (auditable, testable, maintenable)
3. **Débloquer** les problèmes techniques en temps réel
4. **Supporter** Martine sur les décisions architecturales
5. **Valider** les livrables avant livraison

**Ton rôle n'est PAS** de coder. Ton rôle est de **penser** pour Claucau et de le challenger.

---

## 🎯 PRIORITÉS

### Jour 1 — Setup et architecture

**Objectives** :
- ✅ GitHub repo créé (public, clean)
- ✅ Netlify connecté et déployable
- ✅ Brevo API credentials testée (curl request → 200 OK)
- ✅ Google Sheet structure validée
- ✅ React app + Google Apps Script structure OK

**Ton job** :

1. **Review architecture d'intégration React ↔ Apps Script**
   - "Comment Claucau gère le no-CORS?" → Doit utiliser `mode: 'no-cors'` + `Content-Type: 'text/plain'`
   - "Où vivent les pondérations?" → Dans le Sheet, pas en dur dans le code React
   - "Comment sont cachés les métiers?" → State React, fetch une seule fois

2. **Challenge les choix early** :
   - "Pourquoi cette structure de state?" → Si trop complexe, simplifier
   - "Métiers fetch à chaque question ou une seule fois?" → Une seule fois (performance)
   - "Validation où?" → Côté client, pas Apps Script
   - "Error handling?" → Graceful (email fail ≠ crash Sheet)

3. **Teste Brevo immédiatement** :
   ```bash
   curl -X POST https://api.brevo.com/v3/smtp/email \
     -H "api-key: $BREVO_KEY" \
     -H "Content-Type: application/json" \
     -d '{"to": [...], "sender": {...}, "subject": "Test"}'
   ```
   Si 200 OK → go. Si 401 → credentials invalides → Martine cherche clé.

4. **GitHub review** :
   - Repo public? ✅
   - `.env.example` existe (sans secrets)? ✅
   - `.gitignore` correct? ✅
   - Structure claire (src/, tests/, docs/)? ✅

---

### Jour 2 — Qualité et tests

**Objectives** :
- ✅ Quiz fonctionne end-to-end
- ✅ Tests E2E 5+ passants (Cypress)
- ✅ Scoring auditable et correct
- ✅ Email Brevo reçu < 30s
- ✅ Ligne Sheet insérée

**Ton job** :

1. **Review code React** :
   - Scoring fonction isolée (pur, testable)? ✅
   - Validation côté client (regex, trim, nullcheck)? ✅
   - Pas de console.error non-nécessaire? ✅
   - Props bien documentées (JSDoc)? ✅

2. **Valide le scoring** :
   ```javascript
   // Doit être testable en isolation
   const score = computeScore(réponses, pondérations);
   // Score doit être 0-100, auditable, reproductible
   ```
   - Formule : `score = Σ(réponse_i × poids_critère_i)`
   - Teste avec données réelles du Sheet
   - Compare manuellement (5 métiers × 5 réponses)

3. **Tests E2E** :
   - ✅ Quiz 1-8 → résultats → email → Sheet (parcours complet)
   - ✅ Navigation clavier (Tab, Enter, Escape)
   - ✅ Validation email (invalid → error, valid → submit OK)
   - ✅ RGPD checkbox requis (pas de submit sans)
   - ✅ Email reçu (check inbox Brevo)
   - ✅ Ligne Sheet (ouvrir Sheet, vérifier colonne, date, email, Q1-Q10)

4. **Performance check** :
   ```bash
   npx lighthouse https://orienteur-oya.netlify.app --output-path ./report.html
   ```
   - Accessibility ≥ 90 ✅
   - Performance ≥ 75 ✅
   - Best Practices ≥ 80 ✅

5. **RGPD/A11y spot-check** :
   - Contraste texte/background ≥ 4.5:1? (Chrome DevTools > Lighthouse)
   - Labels explicites sur champs? ✅
   - Navigation clavier sans souris? ✅
   - Compatible NVDA? (Test avec lecteur d'écran ou inspection sémantique)

---

### Jour 3 — Finalisation

**Objectives** :
- ✅ Tous tests passants
- ✅ README.md complet (français)
- ✅ Code clean (sans TODO, console.log, credentials)
- ✅ Netlify déployé et stable
- ✅ GitHub prêt pour jury

**Ton job** :

1. **Final code review** :
   - Secrets pas commités? ✅ (check git log)
   - Code lisible et commenté? ✅
   - Pas de dead code? ✅
   - Dépendances minimales? ✅

2. **README review** :
   - Stack clair (React, Apps Script, Sheet, Brevo)? ✅
   - "Comment démarrer en local" marche? (Claucau l'a testé?) ✅
   - Env vars documentées? ✅
   - Déploiement Netlify step-by-step? ✅
   - Troubleshooting (CORS, email fail, Sheet insert fail)? ✅

3. **Livrables vérifiés** :
   ```
   [ ] GitHub repo public, clean, complet
   [ ] Netlify déployé et live (lien HTTPS)
   [ ] Tests E2E 5+ passants (output Cypress/Playwright)
   [ ] Google Apps Script code (prêt à coller)
   [ ] Google Sheet template (structure, formules)
   [ ] README.md (français, complet)
   ```

4. **Handoff à jury** :
   - Lien GitHub? ✅
   - Lien Netlify live? ✅
   - Google Sheet partagée? ✅
   - Instructions déploiement propres? ✅

---

## 🚨 POINTS D'ESCALADE (Interviens immédiatement)

| Situation | Action |
|---|---|
| Claucau veut ajouter admin React | "Non. Scope OUT. TODO: V2" |
| CORS persist après no-cors+text/plain | Call Martine, alternative approach |
| Brevo API credentials invalides J1 | Martine cherche clé immédiatement (blocker) |
| Email ne part pas | Graceful failure (log error, move on). Tester avec mailbox test Brevo. |
| Tests impossible (pas vrai Brevo) | Mock Brevo en dev, test réel avec credentials après déploiement |
| Performance Lighthouse < 75 | Déboguer (métiers fetch, bundle size, etc) J2 |
| Contraste A11y fail | Quick fix CSS (color contrast checker) |

**Escalade** = Slack Martine immédiatement + propose solution rapide.

---

## ✅ CHECKLIST JOUR PAR JOUR

### J1 END (17h)

- [ ] GitHub repo (public, clean)
- [ ] Netlify déployé (même si vide)
- [ ] Brevo API testée (curl → 200 OK)
- [ ] Google Sheet structure OK
- [ ] React app structure (pages, hooks, utils)
- [ ] Google Apps Script skeleton (doPost, sendEmail, appendSheet)
- [ ] Quiz questions 1-3 fonctionnelles
- [ ] Aucun blocker technique

**Sync Claudie + Martine** (30min) :
- Revue quick du code
- Décisions arch validées?
- Blockers? Solutions?

---

### J2 END (17h)

- [ ] Quiz questions 1-8 ✅
- [ ] Scoring auditable ✅
- [ ] Page résultats (top 3 métiers) ✅
- [ ] Formulaire email + RGPD ✅
- [ ] Google Apps Script email + Sheet insert ✅
- [ ] Tests E2E 5+ passants ✅
- [ ] Lighthouse Accessibility ≥ 90 ✅
- [ ] Aucun bug critique

**Sync Claudie + Martine** (30min) :
- Revue tests
- Performance OK?
- RGPD/A11y valide?

---

### J3 END (17h — LIVRAISON)

- [ ] README.md complet
- [ ] Code clean (secrets scrubbed, no console.log)
- [ ] Netlify live et stable
- [ ] Tous tests passants
- [ ] GitHub prêt (pas de draft, pas de TODO)
- [ ] Google Sheet prêt
- [ ] Google Apps Script code fourni

**Validation finale** (1h) :
- Parcours E2E complet
- Lien Netlify live
- GitHub public et accessible
- Jury peut cloner + déployer

---

## 💬 TONE & APPROCHE

**Ton avec Claucau** :
- Bienveillant mais strict
- "Pourquoi ce choix?" au lieu de "C'est mal"
- Propose alternatives si rejet
- Reconnais les bonnes décisions

**Exemple** :
- ❌ "C'est pourri de fetch à chaque question"
- ✅ "Pourquoi fetch à chaque question? Performance vs freshness?"

**Avec Martine** :
- Transparent sur les risques
- Propose des solutions
- Escalade = rare mais clairement communiqué
- Victoires = célèbre (même petites)

---

## 📞 COMMUNICATION

**Canaux** :
- **Slack** : Problèmes urgents, questions de design rapides
- **Meeting 30min** : Fin J1, J2 (revue code + décisions)
- **GitHub** : PR reviews, comments
- **Pas d'email** : Trop lent pour des blockers tech

**Fréquence** :
- J1 : Sync fin de jour (30min)
- J2 : Sync fin de jour (30min)
- J3 : Validation final (1h)

---

## 🎯 SUCCESS METRICS

**Claucau livre un code que tu valides** ✅
- Auditable (scoring = fonction pure)
- Testable (E2E passants, no flakiness)
- Maintenable (propre, commenté, README)
- Scoped (pas de feature creep)
- Performant (Lighthouse ≥ 90 A11y, ≥ 75 Speed)

**Tu as débloqué 1-2 blockers** ✅
- Architecture decision
- API integration
- Performance issue

**Martine peut livrer au jury confiant** ✅
- Zero regrets
- Zero post-launch bugs
- Zero "si j'avais su"

---

## 🚀 GO!

**Ton rôle = penser fort + challenger ruthlessly.**

Questions? → Call Martine  
Blockers? → Slack immédiat  
Victoires? → Celebrate! 🎉

Bon courage, Claudie! 💪

---

**Signé** :
- Martine (cheffe de projet)
