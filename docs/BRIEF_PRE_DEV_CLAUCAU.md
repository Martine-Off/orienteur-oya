# BRIEF PRÉ-DEV — Claucau (Claude Code)

**Statut:** Visily 1 finalisé ✅ | Visily 2 en cours (7 artboards)  
**Timeline:** Démarre code dès maintenant, Visily 2 arrive J+2

---

## 📦 CE QUE TU AS MAINTENANT

✅ **Visily 1 (Landing/Résultats/Confirmation)**
- 6 écrans (375px mobile + 1440px web)
- Structure UX validée
- Design system OYA appliqué
- Download PDF: `/mnt/user-data/uploads/visily-multiscreens.pdf`

✅ **Design System complet**
- Couleurs HEX exactes
- Typos (Poppins/Aller Display)
- Spacing 8px grid
- Composants (buttons, inputs, checkboxes, cards)
- Ornements (feuilles, traits, badges)

✅ **Prompts React**
- Structure quiz (Q1-Q8 questions fermées)
- Scoring déterministe (fonction pure, auditable)
- Validation côté client
- POST vers Apps Script (endpoint configurable)

---

## 🚀 CE QUI ARRIVE (Visily 2)

**7 artboards (768px tablette):**

**Page 1 — Vos préoccupations** (3 artboards)
- Default: 10 checkboxes (2 colonnes), tous décoché
- Checked: 3 items cochés (exemple visuel)
- Focus: keyboard focus visible (outline 2px orange)
- **Action dev:** Multi-select checkboxes (plusieurs réponses OK)

**Page 2 — Cadre de vie** (4 artboards)
- Default: 3 boutons (Urbain/Campagne/Flexible) non sélectionnés
- Selected: 1 bouton sélectionné (border + left accent bar 4px)
- Hover: border + bg change
- Focus: outline keyboard focus
- **Action dev:** Single-select buttons (1 seul réponse)

---

## 💡 PRÉPARE MAINTENANT (SANS ATTENDRE VISILY 2)

### 1. Structure React (Quiz flow)
```
Landing → Quiz (Q1-Q8) → Peurs → Cadre de vie → Résultats → Confirmation
```
- [ ] Créer pages: Landing, Quiz, Peurs, CadreVie, Résultats, Confirmation
- [ ] Navigation [Suivant] / [Précédent] entre pages
- [ ] State management: réponses quiz + peurs + cadre de vie
- [ ] Barre progression (% complété)

### 2. Composants à construire
- [ ] **QuestionContainer:** header fixe + progress bar + content + footer fixe
- [ ] **CheckboxGroup:** multi-select, 2 colonnes responsive
- [ ] **ButtonGroup:** single-select, full-width stacked (3 items)
- [ ] **Button:** Primary (orange #EF8D11) + Secondary (outline orange)
- [ ] **Input:** Email avec validation
- [ ] **Card:** Résultats (3 blocs avec scores et métiers)

### 3. Design system en code
- [ ] Créer variables CSS:
  ```css
  --color-orange: #EF8D11;
  --color-green: #38AA3F;
  --color-salmon: #FFFBF8;
  --color-text: #424242;
  --spacing-s: 16px;
  --spacing-m: 24px;
  --font-body: Poppins Regular 14px;
  --font-h2: Poppins SemiBold 20px;
  ```
- [ ] Appliquer sur tous les boutons/inputs/checkboxes
- [ ] Ornements (feuilles SVG, traits CSS)

### 4. Validation & Scoring
- [ ] Fonction `computeScore()`: auditable, pure
- [ ] Validation email regex
- [ ] RGPD checkboxes requis (2/2 obligatoires)
- [ ] Pas d'erreur silencieuse (console warnings OK, errors NO)

### 5. Apps Script integration
- [ ] `doPost(e)` endpoint prêt
- [ ] Brevo API payload prêt
- [ ] Sheet insert (colonnes pour Peurs + Cadre de vie)

---

## 🎨 POINTS D'ATTENTION

**Responsive:**
- Visily 1 = 375px (mobile) + 1440px (web)
- Visily 2 = 768px (tablette) uniquement
- Toi = adapter 3 résolutions en code (mobile/tablet/web)

**Checkboxes (Page Peurs):**
- Multi-select = plusieurs items cochés OK
- Stocke en state: `{ chômage: false, budget: true, ... }`

**Buttons (Page Cadre de vie):**
- Single-select = 1 seul item sélectionné
- Stocke en state: `{ cadreVie: "Campagne" }`

**Ornements:**
- Feuilles botaniques + traits ondulés (Visily 2 montrera le placement)
- Ajouter en SVG ou CSS background (légers, non-critiques)

---

## 📞 QUESTIONS POUR TOI?

- Veux-tu que je crée les prompts React détaillés (composants, hooks)?
- Besoin des illustrations placeholder (SVG simple)?
- Setup GitHub/Netlify dès maintenant ou après Visily 2?

---

**Visily 2 arrive J+2 → Sync avec Claudie après.**

Go! 🚀
