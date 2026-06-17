# DESIGN SYSTEM OYA — VISILY (Copie/colle dans page "Design System")

## PALETTE COULEURS

**Couleurs primaires (CTA, accents)**
- Orange #EF8D11 (boutons, hover, focus, highlights)
- Jaune/Or #F9B233 (sous-accents, titres secondaires)

**Couleurs nature (validation, success)**
- Vert Anis #38AA3F (checkboxes checked, validation, success states)
- Vert Foncé #C23614 (contraste, éléments secondaires)

**Couleurs fond/soft**
- Salmon #F2786E (fonds cards, RGPD block soft bg)

**Couleurs texte/structure**
- Texte principal: #424242 (gris foncé)
- Texte secondaire: #888888 (gris moyen)
- Bordures: #E8E8E8 (gris très clair)
- Blanc fond: #FFFFFF

---

## TYPOGRAPHIES

**H1 — Aller Display (Titres pages)**
- Font: Aller Display (ou Georgia, serif fallback)
- Size: 32px (mobile) → 40px (web)
- Weight: Bold (700)
- Color: #424242
- Line-height: 1.2
- Case: Sentence case ("Découvrez votre orientation")

**H2 — Poppins SemiBold (Sous-titres, accroches)**
- Font: Poppins SemiBold (600)
- Size: 18-20px
- Color: #EF8D11 (souvent) ou #424242
- Case: Sentence case

**H3 — Poppins SemiBold (Labels, cartes)**
- Font: Poppins SemiBold (600)
- Size: 14-16px
- Color: #424242

**Body — Poppins Regular**
- Font: Poppins Regular (400)
- Size: 14px
- Color: #424242
- Line-height: 1.6

**Small/Caption — Poppins Regular**
- Font: Poppins Regular (400)
- Size: 12px
- Color: #888888

---

## COMPOSANTS

**Button Primary (CTA)**
- Background: #EF8D11
- Text: white, Poppins SemiBold 14px
- Padding: 12px 24px
- Min-height: 48px
- Border-radius: 4px
- Hover: background #D67C0A (darker)
- Focus: outline 2px solid #EF8D11, outline-offset 2px
- Active: scale 0.98 (feedback)
- Full-width mobile, auto-width web

**Button Secondary (Navigation)**
- Background: transparent
- Border: 2px solid #EF8D11
- Text: #EF8D11, Poppins SemiBold 14px
- Padding: 10px 22px
- Min-height: 48px
- Hover: background #FFF5E6 (very light orange)

**Input (Email, Texte)**
- Border: 1px solid #E8E8E8
- Padding: 12px 16px
- Min-height: 44px
- Border-radius: 4px
- Font: Poppins Regular 14px
- Focus: border 2px solid #EF8D11, outline none
- Placeholder: gray #888

**Checkbox**
- Size: 20×20px
- Border: 2px solid #E8E8E8
- Checked: #38AA3F avec checkmark white
- Focus: outline 2px solid #EF8D11

**Card (Résultats, Peurs)**
- Border: 1px solid #E8E8E8
- Border-radius: 8px
- Padding: 24px
- Background: white #FFFFFF
- Hover: box-shadow 0 2px 8px rgba(0,0,0,0.1)

**Progress Bar**
- Height: 8px
- Background: #E8E8E8
- Fill: #38AA3F (success) ou #EF8D11 (orange) ou #F2786E (salmon)
- Border-radius: 4px
- Animation: smooth fill 0.5s ease-out

---

## ÉLÉMENTS GRAPHIQUES

**Logo OYA**
- Couleur complète: 80px height (landing), 40px (intérieures)
- Blanc: sur fonds foncés
- Noir/Gris: sur fonds clairs
- Zone protection: 10% de la hauteur autour

**Feuilles botaniques**
- Couleur: Vert #38AA3F ou Vert Foncé #C23614
- Placement: coin haut-droit sections, décoration légère
- Taille: variable (30-80px)
- Style: simple, outline ou filled

**Traits ondulés (séparateurs)**
- Couleur: #EF8D11 (souvent) ou #E8E8E8
- Épaisseur: 2-4px
- Placement: entre sections
- Animation: optional (subtle wave)

**Badges**
- "Nouvelle formation": cercle orange #EF8D11, texte white, 14px
- "Question": losange vert #38AA3F, "?" blanc centré
- Placement: haut-droit card ou centre

**Ornements botaniques (enrichissement)**
- Fleur stylisée: 3-5 pétales
- Feuille dentelée: formes organiques
- Soleil: cercle + rayons
- Orange stylisée: agrume simplifié
- Motif RSS/ondes: lignes concentriques

---

## SPACING (8px grid)

- XS: 8px (micro margins)
- S: 16px (padding inputs, small gaps)
- M: 24px (padding cards, standard gaps)
- L: 32px (section gaps)
- XL: 48px (top/bottom padding pages)

---

## RESPONSIVE BREAKPOINTS

**Mobile (375px)**
- 1 colonne
- Fullwidth buttons, inputs
- Padding S/M
- Stack vertical

**Tablet (768px)**
- 2 colonnes (flexible)
- Buttons/inputs auto-width
- Padding M
- Layout begins

**Web (1440px)**
- 3+ colonnes
- Max-width 1200px, centered
- Padding L/XL
- Multi-column grids

---

## INTERACTIONS

**Button**
- Default: #EF8D11, white text
- Hover: #D67C0A (darker)
- Focus: outline 2px Orange
- Active: scale(0.98)
- Disabled: opacity 0.5, cursor not-allowed

**Input**
- Default: border #E8E8E8
- Focus: border 2px #EF8D11
- Error: border 2px #C23614, bg #FFF0F0

**Card**
- Default: border #E8E8E8, no shadow
- Hover: shadow 0 2px 8px

**Checkbox**
- Default: border #E8E8E8
- Checked: #38AA3F checkmark white
- Focus: outline 2px #EF8D11

**Progress**
- Animate fill 0.5s ease-out

---

## MICROCOPY TONALITÉ

- Vouvoiement systématique ("vous", "votre")
- Ludique mais professionnel
- Bienveillant (pas de jugement)
- Clair (pas de jargon)
- Sentence case (jamais ALL CAPS)

Exemples:
- "Découvrez votre orientation" (pas "DÉCOUVREZ")
- "De la fourche à l'assiette" (pas "FORK TO TABLE")
- "Vos 3 orientations principales" (pas "TOP 3 RESULTS")

---

## ACCESSIBILITY

- Min 44px inputs, 48px buttons
- Contraste 4.5:1 minimum
- Labels explicites
- Focus visible (outline 2px)
- Keyboard navigation complète
- No color-only meaning

---

## FICHIERS ASSETS

**Logos**
- logo_oya.svg (couleurs)
- logo_oya_blanc.svg (blanc/fonds foncés)
- logo_oya_noir.svg (noir/fonds clairs)

**Ornements (à extraire/créer)**
- Feuilles (vert #38AA3F, vert foncé #C23614)
- Traits ondulés (#EF8D11, #E8E8E8)
- Badges (cercle orange, losange vert)
- Motifs botaniques
