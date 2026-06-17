# 📦 INDEX — POC L'Orienteur OYA pour Claucau (Claude Code)

**Date:** 17 juin 2026  
**Statut:** UX/Design FINALISÉ ✅ | Prêt pour DEV

---

## 📁 FICHIERS À TÉLÉCHARGER & PARTAGER

### **1. VISILY (Écrans de référence)**
- `visily-multiscreens.pdf` → **Visily 1** (Landing/Résultats/Confirmation, 375px mobile + 1440px web)
- `visily-multiscreens2.pdf` → **Visily 2** (Peurs/Cadre de vie, 390px mobile, états visuels)

### **2. BRIEF & DOCUMENTATION**
- `BRIEF_PRE_DEV_CLAUCAU.md` → **Ta mission** (pages, composants, design system, validation, Apps Script)
- `VISILY_DESIGN_SYSTEM_PROMPT.md` → **Charte graphique complète** (couleurs HEX, typos, spacing, composants)
- `RECAP_VISILY1_VS_VISILY2.md` → **Différences Visily 1 vs 2** (ce qu'on voit où)

### **3. CAHIER DES CHARGES (du projet)**
- `cahier-des-charges.md` → Scope officiel, livrables, critères d'acceptation
- `note-de-cadrage.md` → Hypothèses, risques, blockers, timeline
- `gherkin-flux-utilisateur-poc.md` → Parcours UX détaillé (quiz 7-8 questions)
- `gherkin-flux-backend-poc.md` → Flux Boris + structure Google Sheet

### **4. DATA**
- `CSV_87_Metiers_OYA_V2_Niveau_MIN.csv` → 87 métiers (métier, bloc, compétences, etc.)
- `Charte-Graphique-OYA.md` → Design system OYA complet

### **5. PROMPTS POUR CLAUDE CODE (si besoin)**
- `prompt-clauco-claude-code.md` → Brief technique complet pour Claude Code (architecture, scoring, etc.)

---

## 🎯 CLAUCAU, COMMENCE PAR:

**Ordre de lecture (30 min):**
1. `BRIEF_PRE_DEV_CLAUCAU.md` (ta roadmap)
2. `cahier-des-charges.md` (scope officiel)
3. `gherkin-flux-utilisateur-poc.md` (UX parcours)
4. Regarde les 2 PDFs Visily (5 min chacun)

**Puis construis:**
- Structure React (pages: Landing → Quiz → Peurs → CadreVie → Résultats → Confirmation)
- Composants (CheckboxGroup, ButtonGroup, Button, Input, Card)
- CSS variables (couleurs, spacing, typos)
- Validation + Scoring
- Google Apps Script endpoint

---

## 🔗 OÙ TROUVER LES FICHIERS?

**Option A: GitHub**
Crée un repo GitHub `orienteur-oya-poc` et push:
```
/project-files/
  ├── visily-multiscreens.pdf
  ├── visily-multiscreens2.pdf
  ├── BRIEF_PRE_DEV_CLAUCAU.md
  ├── VISILY_DESIGN_SYSTEM_PROMPT.md
  ├── cahier-des-charges.md
  ├── gherkin-flux-utilisateur-poc.md
  ├── gherkin-flux-backend-poc.md
  ├── CSV_87_Metiers_OYA_V2_Niveau_MIN.csv
  └── Charte-Graphique-OYA.md
```

**Option B: Dossier partagé**
- Google Drive
- Dropbox
- Discord (fichiers)

---

## ✅ PRÊT À LANCER DEV?

Une fois que tu as tous les fichiers:

1. Lis `BRIEF_PRE_DEV_CLAUCAU.md`
2. Ouvre les 2 PDFs Visily côte à côte (référence visuelle)
3. Clone ou crée le repo GitHub
4. Lance `npm create vite@latest -- --template react`
5. Commence par la structure React
6. Sync avec Claudie (superviseur tech) à la fin de J1

---

**Questions?** Demande à Claudie ou relance moi.

Go! 🚀
