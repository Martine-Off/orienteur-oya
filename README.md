# POC_OYA — Dossier de démarrage

**Date** : 16 juin 2026  
**Durée** : 3 jours × 7h = 21h  
**Livraison** : 23 juin 2026 (démo fonctionnelle)

---

## 📂 Contenu du dossier

### **Documentation projet**
- `cahier-des-charges.md` — Objectif, scope, contraintes, livrables
- `note-de-cadrage.md` — Hypothèses, dépendances, risques, blockers
- `PARTIE-2-solution-proposee.md` — Architecture technique complète (du dossier final)

### **Spécifications (Gherkin BDD)**
- `gherkin-flux-utilisateur-poc.md` — Parcours utilisateur étape par étape
- `gherkin-flux-backend-poc.md` — Flux données Boris + TCDs

### **Prompts pour Claude**
- `prompt-clauco-claude-code.md` — Brief complet pour Claude Code (dev)
- `prompt-claudie-supervision.md` — Brief pour superviseur tech (Claudie)

### **Données**
- `CSV_87_Metiers_OYA_V2_Niveau_MIN.csv` — Les 87 métiers (structure)
- `schema-architecture-miro.png` — Schéma flux technique

### **Design**
- `charte-graphique-OYA.txt` — Couleurs hex, typos, logo (à demander à Boris)

### **Application (POC)**
- `src/` — Code source React + Vite de l'application
- `google-apps-script/` — Code Apps Script (backend)
- `cypress/` — Tests E2E
- Voir `README-TECHNIQUE.md` pour le détail technique (stack, installation, déploiement)

---

## 🚀 Démarrage

**J0 (aujourd'hui)** :
1. Lire `cahier-des-charges.md` et `note-de-cadrage.md`
2. Claucau lit `prompt-clauco-claude-code.md`
3. Claudie lit `prompt-claudie-supervision.md`
4. Martine confirme charte OYA (couleurs, typos) auprès de Boris

**J1-J3** :
- Claucau : code React + Apps Script + tests
- Claudie : supervise, débloque, valide
- Martine : coordonne, gère GitHub/Netlify, prépare le Sheet

**J4** : Démo 23 juin

---

## ✅ Livrables attendus

- [ ] GitHub repo public (React + Apps Script + README)
- [ ] Netlify déployé et fonctionnel
- [ ] Google Sheet avec structure (Métiers / Réponses / Analytics)
- [ ] Tests E2E passants
- [ ] README.md technique (français)

---

**Questions pré-démarrage** :
- Brevo API credentials prêts?
- Charte OYA fournie?
- Accès GitHub pour Claucau?

Bon courage! 🚀
