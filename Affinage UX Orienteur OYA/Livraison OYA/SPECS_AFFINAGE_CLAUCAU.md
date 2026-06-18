# SPECS D'AFFINAGE — POC L'Orienteur OYA

**De :** Claude (UX/Design) → **Pour :** Claucau (dev)
**Branche :** `ux/final-complete`
**Base :** revue croisée Visily 1 + Visily 2 ↔ code (`App.jsx`, `Question.jsx`, `App.css`, `questions.js`)
**Date :** 18 juin 2026

> Format : **« voici quoi changer et pourquoi »**, pas du code à copier. Les points marqués 🟥 **P1** sont des écarts visibles à corriger en priorité, 🟧 **P2** des affinages, 🟦 **P3** du nettoyage. Les points marqués ⚖️ **ARBITRAGE** demandent une décision de Martine avant implémentation.

---

## 0. SYNTHÈSE EN 30 SECONDES

L'ossature React/CSS est saine : tokens couleurs OK, blocs cliquables OK, navigation/focus OK, spacing globalement aligné sur la grille 8px. **Trois familles d'écarts** restent à traiter :

1. **Le cyan des maquettes Visily n'est PAS la marque OYA** — et c'est une bonne nouvelle. (§1)
2. **La page « Peurs » (Q9) et les écrans n'ont pas reçu leur habillage** : checkboxes vertes, fond salmon, trait orange + feuille, header/footer. Beaucoup de CSS prévu pour ça existe mais **n'est jamais appelé**. (§2, §3)
3. **Accessibilité contraste** : l'orange et le vert OYA, utilisés en *texte*, passent sous le seuil WCAG AA. À corriger pour le label « POC accessible ». (§6)

---

## 1. ⚠️ LE CYAN VISILY ≠ MARQUE OYA (à acter d'emblée)

Dans les deux PDF Visily, l'accent dominant est un **cyan** (#0FBFD8-ish) : logo « pulse », pourcentages des résultats (`85%`), chiffres-clés (`15min / 100+ / Gratuit`), et même certains CTA (Visily 1, écran 2 : bouton « COMMENCER » cyan).

**Ce cyan est un artefact du thème par défaut de Visily, pas une couleur de la charte OYA.** La charte (les deux docs design system) ne contient aucun cyan : l'accent CTA est **orange #EF8D11**, la validation est **vert #38AA3F**.

➡️ **Le code a raison de ne pas utiliser de cyan.** À retenir pour la suite :
- Partout où Visily montre du cyan → traduire en **orange** (action/CTA/accent) ou **vert** (validation/score positif).
- Pourcentages de résultats : utiliser **vert #38AA3F** (score = signal positif), pas cyan, pas orange.
- Logo : le « pulse » cyan doit être recoloré en marque OYA (voir §4 Header). Idéalement utiliser le vrai `logo_oya.svg`.

🟥 **P1** — Aucun cyan ne doit subsister dans le rendu final.

---

## 2. COHÉRENCE VISILY ↔ CODE, ÉCRAN PAR ÉCRAN

### 2.1 Landing — 🟧 P2 (enrichissement)
Visily 1 (écrans 1/3) montre une landing riche ; le code (`page-landing`) est minimal (logo + pitch + points).

| Élément Visily | Présent dans le code ? | Action |
|---|---|---|
| Image hero (champ/paysage) | ❌ | Ajouter un slot image (placeholder rayé + légende mono « photo paysage agricole »). |
| 3 icônes secteurs (Production / Transformation / Logistique) + labels | ❌ | Ajouter une rangée `flex` 3 items, icône 48px au-dessus du label. |
| Champ email + CTA « Commencer le diagnostic » | ❌ (le CTA existe, l'email non) | ⚖️ voir §2.4 sur le double email. |
| Helper italique « diagnostic en moins de 5 min » | partiel | Aligner sur le token helper (vert italique 12px). |
| Bloc confiance / stats (`15min / 100+ / Gratuit`) | ❌ | Ajouter rangée stats sous séparateur. Chiffres en **vert** (pas cyan). |

### 2.2 Page « Peurs » = Q9 — 🟥 P1 (le plus gros écart)
Visily 2 (écrans 1→3) traite « Vos préoccupations » comme un écran à forte identité :
- **Fond salmon doux** (#FFFBF8) sur la zone question.
- **Trait orange + feuille botanique** en haut de la zone.
- **Cases à cocher VERTES visibles à gauche**, label aligné à gauche (état coché = case verte + fond vert très clair / bordure verte selon variante).
- Helper en **vert italique**.

Dans le code, Q9 (`type: "checkboxes"`) est rendu par `Question.jsx` avec **`.bloc-option`** → blocs centrés, **état sélectionné ORANGE + ✓ en haut à droite**. C'est l'inverse de l'intention.

**Problème clé :** le CSS contient déjà tout le style attendu — `.options-checkboxes`, `.checkbox-option` (case 20px, `accent-color` vert, coché = vert #38AA3F) — **mais ce style n'est jamais utilisé** car `Question.jsx` ne génère pas ces classes. C'est du **code mort**.

➡️ Action (choisir, ⚖️ **ARBITRAGE** sur le style cible) :
- **Option A (recommandée, = Visily écran 2) :** rendre Q9 avec `.options-checkboxes` / `.checkbox-option` (cases vertes visibles, label à gauche, 1 colonne mobile / 2 colonnes ≥768px). Cohérent avec « validation = vert ».
- **Option B (= Visily écran 3) :** garder le format bloc MAIS, pour le multi-select, **état coché = bordure verte + fond vert clair** (pas orange). Suppose d'ajouter un modificateur `.bloc-option--multi.selected` en vert.

Dans les deux cas : **multi-select coché = VERT, jamais orange.** Le commentaire dans le CSS (« checked = vert #38AA3F, pas orange ») confirme cette intention — il faut juste la câbler.

### 2.3 Page « Cadre de vie » = Q3 — ⚖️ ARBITRAGE (position des images)
- **Brief + design system :** image 48×48 **AU-DESSUS** du texte (carte, `flex-column`). Le code fait ça (`.bloc-option--with-image`). ✅
- **Visily 2 (écrans 4→7) :** « Cadre de vie » montre des **lignes avec icône à GAUCHE** du texte (Urbain / Campagne / Flexible), pas des cartes.

Deux patterns coexistent → il faut **n'en garder qu'un**. Reco : conserver **icône au-dessus** (brief « VALIDÉ » + plus visuel pour Q4 « ce qui vous attire »), et appliquer le même pattern à Q3. Si Martine préfère le rendu Visily « ligne icône-gauche » pour Q3, on bascule les deux. **À trancher.**

Note états (utiles quel que soit le choix) — Visily « Cadre de vie » documente clairement :
- **Sélectionné** (écran 6) : bordure **orange** + fond **#FFF5E6** + petit label orange « VOTRE PRÉFÉRENCE » au-dessus.
- **Focus** (écran 7) : contour **orange** (outline 2px). ✅ déjà géré par `:focus-within`.
- **Hover** (écran 5) : bordure verte légère possible — à uniformiser sur l'orange pour cohérence (voir §5).

### 2.4 ⚖️ ARBITRAGE — un seul point de capture email
Visily capture l'email **au début** (landing) ET **à la fin** (résultats, bloc RGPD). C'est redondant et ça crée une friction. Décider :
- **(a)** email en fin de parcours seulement (le plus logique : on demande l'email pour *recevoir le rapport*) → landing = CTA simple « Commencer », pas de champ email ; ou
- **(b)** email en début → pré-rempli en fin.
Reco : **(a)**. Aligner landing et résultats en conséquence.

### 2.5 Résultats — 🟧 P2
Visily 1 (écrans 4/6/10) définit le format cible :
- **3 cartes** Production / Transformation / Logistique, avec **% de match** (vert), une **barre de progression colorée par rang** (rang 1 orange, rang 2 vert, rang 3 salmon), 3 métiers en puces, lien **+ Détails**.
- Bloc **« Vos préoccupations identifiées »** sur **fond salmon**, items cochés en vert (desktop) ou chips orange (mobile).
- Desktop (écran 10) : **trait ondulé orange** sous le titre + **petite feuille** en haut-gauche de chaque carte.

Le code (`thematic-card` / `metier-card`) a une structure différente (score moyen, lignes métier). ➡️ Rapprocher du modèle Visily : carte = % + barre colorée + top-3 métiers + « + Détails ». Conserver le bloc freins/préoccupations en salmon (le CSS `--color-salmon` existe).

### 2.6 Confirmation — 🟦 P3
Visily 1 (écrans 7/9) : coche verte, « Merci ! », encart email destinataire, rappel spam + RGPD, CTA orange « Retour accueil ». Le code (`page-confirmation`, `success-icon` animée) est conforme. ✅ Juste vérifier que le CTA est bien **orange** (et pas cyan) et l'encart présent.

---

## 3. HABILLAGE / ORNEMENTS — 🟥 P1 (prévu mais non câblé)

| Ornement Visily | État dans le code | Action |
|---|---|---|
| **Fond salmon page Peurs** | `.page-quiz--peurs { background: #FFFBF8 }` existe | La classe n'est appliquée nulle part → l'ajouter au conteneur quand `question.id === "Q9"`. |
| **Trait orange séparateur** | `.question-divider` (48px, 3px, orange) existe | Jamais rendu dans `Question.jsx` → l'insérer entre le legend et la grille d'options (au moins sur Q9/Q3, idéalement toutes les questions pour le rythme). Visily le montre **pleine largeur**, pas 48px — voir reco ci-dessous. |
| **Feuille botanique** | ❌ absent | Ajouter une feuille SVG (vert #38AA3F) en haut-droite de la zone question. **Ne pas dessiner une feuille complexe à la main** : utiliser un asset SVG simple fourni (`feuille.svg`) ou un glyphe sobre. |
| **Trait ondulé orange (résultats)** | ❌ | Sous le H1 résultats desktop. Asset SVG simple. |

**Reco trait séparateur :** Visily le montre **pleine largeur, fin (2px), orange**, juste sous la barre de progression. Le `.question-divider` actuel (48px) fait plutôt « accent sous-titre ». Choisir : soit pleine largeur façon Visily, soit garder l'accent court de 48px comme signature de marque. Reco : **pleine largeur 2px orange** sur Peurs/Cadre de vie pour matcher Visily, accent 48px ailleurs.

---

## 4. HEADER / FOOTER PARTAGÉS — 🟧 P2 (manquants)

Visily montre un **header** (logo + titre de page) et un **footer** constants. `App.jsx` n'a pas de layout partagé.

- **Header :** marque OYA à gauche (logo `pulse` + wordmark « OYA Diagnostic »). **Recolorer le cyan en marque OYA** (vert #38AA3F, ou logo bichromie officiel). Hauteur ~64px, bordure-bas #E8E8E8.
- **Barre de progression :** Visily la place **pleine largeur, juste sous le header, épaisse, verte**. Le code la rend *inline avec un label à côté* (`.progress-bar` + `.progress-bar-label`). ➡️ Déplacer en haut, pleine largeur ; le label numérique devient optionnel/discret.
- **Footer :** « Conditions / À propos » + « Contact : hello@oya-diagnostic.fr ». Sur le quiz, Visily met les **boutons nav (Précédent / Suivant) dans une barre basse**. Le `.quiz-actions` actuel (space-between, `margin-top:auto`) reproduit bien ça — OK, juste l'inscrire visuellement comme une barre.

---

## 5. COMPOSANTS — DÉTAILS & INCOHÉRENCES

### 5.1 Bloc cliquable (`.bloc-option`) — 🟧 P2
- **Fond hover/sélection :** le code utilise `rgba(239,141,17,0.06)` (hover) et `rgba(239,141,17,0.09)` (selected). La charte définit un token précis : **#FFF5E6**. ➡️ Utiliser **#FFF5E6** pour hover ET selected (teinte cohérente, pas un alpha qui dérive selon le fond, important sur le fond salmon de Q9).
- **Texte sélectionné :** le code passe le **texte en orange #EF8D11 + bold**. Visily (écran 6) garde le **texte sombre**, seuls bordure + fond changent. ➡️ **Garder le texte #424242** au survol/sélection (lisibilité + WCAG, cf §6). L'orange reste sur la **bordure** et le label accessoire.
- **Pastille ✓ (haut-droite) :** ajoutée par le code (`.selected::after`), **absente de Visily** pour le single-select. ➡️ Reco : **retirer le ✓ sur le single-select** (bordure + fond suffisent) ; **garder une case cochée visible uniquement sur le multi-select** (Q9), conformément à Visily.

### 5.2 Grilles responsive — 🟥 P1 (bug mobile)
- `.options-blocs--multi` (Q9) = `repeat(2,1fr)` **sans repli mobile** → sur 375px les libellés (« Conditions météo / intempéries ») sont écrasés sur 2 colonnes. **Visily Peurs mobile = 1 colonne.** ➡️ Ajouter `@media (max-width:599px){ grid-template-columns:1fr }` à `--multi` (et idéalement basculer Q9 vers `.options-checkboxes` qui gère déjà 1col mobile / 2col ≥768).
- `.options-blocs--inline` (oui/non) et `--grid` (cartes) : OK en 2 colonnes, mais vérifier le rendu des cartes-image sur 375px (icône 40px + label) — 2 colonnes acceptable, sinon 1 colonne.
- Récap breakpoints cible : **375 = 1 col** (sauf oui/non 2 col), **768 = 2 col**, **1440 = 3 col** (cartes/blocs simples). Conforme au brief.

### 5.3 États focus — 🟦 P3
Le code mélange `outline 2px` (`.bloc-option`) et `outline 3px` (`.checkbox-option`, `.option-pill`, `.option-card`). ➡️ **Standardiser sur 2px + offset 2px** (= charte). Garder l'orange.

### 5.4 Code mort à supprimer — 🟦 P3
Ces classes ne sont jamais générées par `Question.jsx` : `.options`, `.options-inline`, `.option-pill`, `.options-cards`, `.option-card`. Et `.options-checkboxes`/`.checkbox-option` ne le sont **pas encore** (à câbler, cf §2.2) ou à supprimer si on choisit l'Option B. ➡️ Nettoyer pour éviter la confusion de maintenance.

---

## 6. ACCESSIBILITÉ — CONTRASTE 🟥 P1 (bloquant pour « POC accessible »)

Calculs WCAG sur fond blanc :

| Couleur | Ratio /blanc | Texte normal (≥4.5) | Gros texte (≥3.0) |
|---|---|---|---|
| Orange #EF8D11 | **~2,5:1** | ❌ | ❌ |
| Orange foncé #D67C0A | ~2,9:1 | ❌ | ❌ |
| Vert #38AA3F | **~3,0:1** | ❌ | ✅ (limite) |
| Texte #424242 | ~9,7:1 | ✅ | ✅ |

**Conséquences concrètes :**
1. **CTA orange, texte blanc** (`btn-primary`) : blanc sur #EF8D11 ≈ **2,5:1 → échoue**. Le fond du bouton peut rester orange (identité), mais pour conformité AA il faut **soit foncer le bouton à ~#A85D08** (≈4,5:1 avec blanc), **soit** monter le texte à « gros texte » (≥18,66px **bold**) et l'assumer comme exception documentée. ⚖️ décision marque/accessibilité.
2. **Texte orange sur blanc** (`+ Détails`, texte de bloc sélectionné, etc.) : échoue. ➡️ **Ne jamais utiliser l'orange en texte** : réserver l'orange aux **fonds, bordures, icônes**. Pour un lien type « + Détails », utiliser **#A85D08** (orange foncé) ou le souligner + #424242.
3. **Vert #38AA3F en texte** (legend question, helper, pourcentages) : passe seulement en **gros texte gras**. Pour le helper (12px) et tout texte vert < 18px → **foncer à ~#2E7D33** (≈4,5:1) ou passer en #424242. Le legend (gros + gras) reste OK mais limite — foncer un peu sécurise.

➡️ Reco synthèse : **garder les couleurs de marque pour fonds/bordures/icônes/gros titres ; pour tout texte courant, utiliser #424242, et des variantes foncées (#A85D08, #2E7D33) quand la couleur de marque est nécessaire en texte.**

(Le reste de la checklist a11y est bon : labels via `<legend>`/`<label>`, navigation clavier Tab/Espace/Entrée, focus visible, pas de sens porté par la seule couleur tant qu'on garde la case cochée visible sur Q9.)

---

## 7. TYPOGRAPHIE — RÉCONCILIER LES SOURCES 🟧 P2

Trois sources divergent légèrement :

| | Brief (en-tête, « VALIDÉ ») | Doc Design System Visily | Maquettes Visily (rendu) | Code actuel |
|---|---|---|---|---|
| **Titre page (H1)** | 28px SemiBold **vert** | 32-40 Bold **#424242**, Aller Display | grand, **sombre**, bold | (résultats `h1` centré) |
| **Question (H2)** | 16px SemiBold **vert** | 18-20 SemiBold orange | sombre/bold ~18px | `legend` **1.3rem (≈20,8px) / 700 / vert** |
| **Helper** | 12px italic vert | 12px gris | — | `0.85rem` gris |

**Écarts à trancher :**
- **Couleur des titres/questions :** les maquettes les montrent **sombres** ; le brief dit **vert**. ⚖️ Reco : **question en #424242** (lisibilité + cohérence Visily + libère le vert pour la validation), **vert réservé aux accents/validation**. Si Martine tient au titre vert, foncer le vert (cf §6).
- **Taille question :** le code (≈20,8px) est plus grand que le brief (16px). La question étant l'élément central, **garder ~20px** est mieux que 16px ; aligner le **poids sur 600** (SemiBold, pas 700) comme la charte.
- **Helper :** aligner sur le token charte → **12px italic**, fond **#F0FFF4** optionnel (encart helper) ; couleur foncée si vert (cf §6). Actuellement `0.85rem` non-italique gris.
- **Police :** confirmer **Poppins** chargée partout (le brief « VALIDÉ » impose Poppins ; l'autre doc mentionne « Aller Display » pour H1 — **abandonner Aller Display**, s'en tenir à Poppins pour la cohérence et la simplicité du POC).

---

## 8. SPACING — 🟦 P3 (quasi OK)

- Grille 8px respectée. `gap` blocs **10px** : hors-grille (8 ou 12). Mineur, mais pour la rigueur passer à **12px** (= S/2 arrondi) ou assumer 10px partout. Cohérence > valeur exacte.
- `.question-hint { margin: -8px 0 4px }` — le **margin négatif** est un patch (le `gap:16px` du conteneur pousse le hint trop bas, le -8px le remonte). ➡️ **Refactoriser proprement :** envelopper `legend` + `hint` dans un petit en-tête (`flex-column`, `gap:4px`) hors du `gap:16px`, et mettre `margin:0` sur le hint. Plus robuste que le margin négatif.
- `.quiz-actions` : `margin-top:auto` (mobile) / `32px` (desktop) — bien, garde la nav en bas. ✅

---

## 9. RÉPONSES AUX 6 QUESTIONS DU BRIEF

1. **Tout est cohérent ? Qu'est-ce qui diverge ?**
   Ossature cohérente. Divergences majeures : (a) habillage Peurs non câblé alors que le CSS existe (§2.2/§3), (b) checkboxes multi-select rendues en orange+✓ au lieu de vert (§2.2), (c) header/footer/barre de progression pleine largeur absents (§4), (d) contraste orange/vert en texte sous WCAG (§6), (e) cyan Visily à ignorer — déjà fait, à confirmer (§1).

2. **Page Peurs — texte + couleur de fond à affiner ?**
   Oui : appliquer le **fond salmon #FFFBF8**, le **trait orange + feuille**, le **helper vert italique**, et surtout les **cases vertes** (§2.2). Le contenu texte des 10 peurs est bon ; juste 1 colonne sur mobile (§5.2).

3. **Ornements botaniques implémentés ?**
   **Non.** `.question-divider` existe mais n'est pas rendu ; feuilles et trait ondulé absents. À câbler avec des assets SVG **simples** (ne pas dessiner de feuilles complexes à la main) (§3).

4. **Mobile 375px — blocs 1 colonne, OK ?**
   **Bug :** `--multi` (Q9) reste en 2 colonnes sur mobile → libellés écrasés. À passer en 1 colonne (§5.2).

5. **Tablet 768px — 2 colonnes (sauf Q9) — OK ?**
   La grille de base bascule bien en 2 col ≥600px. Pour Q9, Visily tablet = **2 colonnes** aussi (pas une exception) — câbler `.options-checkboxes` règle ça proprement (1 col mobile / 2 col ≥768) (§2.2/§5.2).

6. **Autres affinages visuels ?**
   - Retirer le ✓ orange du single-select ; garder une case visible pour le multi (§5.1).
   - Texte de bloc sélectionné en sombre, pas orange (§5.1/§6).
   - Tokens #FFF5E6 / #F0FFF4 au lieu d'alphas (§5.1).
   - Standardiser focus 2px (§5.3).
   - Supprimer le code mort (§5.4).
   - Refactoriser le margin négatif du hint (§8).

---

## 10. RÉCAP ACTIONS — ORDRE D'ATTAQUE POUR CLAUCAU

**🟥 P1 — écarts visibles / bloquants**
- [ ] Supprimer tout cyan résiduel ; recolorer logo en marque OYA (§1, §4).
- [ ] Câbler l'habillage Peurs : fond salmon, trait orange, feuille, **cases vertes** au lieu de blocs orange+✓ (§2.2, §3).
- [ ] Q9 `--multi` → **1 colonne sur mobile** (§5.2).
- [ ] Contraste : sortir l'orange/vert du **texte**, foncer là où nécessaire (§6).

**🟧 P2 — affinages**
- [ ] Header + footer + barre de progression pleine largeur (§4).
- [ ] Enrichir la landing (image, 3 secteurs, stats) (§2.1).
- [ ] Aligner les résultats sur le modèle Visily (cartes %, barres colorées, freins salmon) (§2.5).
- [ ] Tokens #FFF5E6/#F0FFF4 ; texte de bloc sélectionné sombre ; retirer ✓ single-select (§5.1).
- [ ] Réconcilier la typo (Poppins partout, question ~20px/600, couleur à trancher) (§7).

**🟦 P3 — nettoyage**
- [ ] Supprimer le code mort CSS (§5.4).
- [ ] Standardiser focus 2px (§5.3).
- [ ] Refactoriser le margin négatif du hint ; gap 12px (§8).

**⚖️ ARBITRAGE Martine (avant implémentation)**
- Style multi-select Q9 : cases vertes (Option A) vs blocs verts (Option B) — §2.2.
- Position images Q3/Q4 : au-dessus (brief) vs icône-gauche (Visily) — §2.3.
- Un seul point de capture email (fin de parcours recommandé) — §2.4.
- CTA orange : foncer pour WCAG vs assumer l'exception — §6.
- Couleur des titres/questions : sombre (reco) vs vert (brief) — §7.
