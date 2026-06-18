# Livraison OYA — L'Orienteur (affinage UX/Design)

**Date :** 18 juin 2026 · **Auteur :** Claude (UX/Design) · **Pour :** Claucau (dev) + Martine (arbitrage)

Contenu de ce dossier — tout ce qui a été produit pendant l'affinage.

---

## 📁 Arborescence

```
Livraison OYA/
├── README.md                          ← ce fichier
├── SPECS_AFFINAGE_CLAUCAU.md          ← revue croisée Visily ↔ code + specs (P1/P2/P3 + arbitrages)
├── design-tokens.css                  ← variables CSS prêtes à coller dans :root (App.css)
├── design-tokens.json                 ← mêmes tokens en JSON (couleurs, typo, spacing, breakpoints)
├── Maquette/
│   ├── Resultats OYA (standalone).html ← maquette CLIQUABLE autonome (hors-ligne, double-clic)
│   └── source/
│       ├── Resultats OYA.dc.html       ← source éditable de la maquette
│       └── support.js                  ← runtime nécessaire à la source
└── Reference Visily (extraits PNG)/    ← 17 écrans des 2 PDF Visily, extraits en images
    ├── v1-01..v1-10.png                ← Visily 1 (Landing / Résultats / Confirmation)
    └── v2-01..v2-07.png                ← Visily 2 (Peurs + Cadre de vie + états)
```

---

## 🎯 Par où commencer (Claucau)

1. **`design-tokens.css`** → coller dans le `:root` (remplace les couleurs ad hoc).
2. **`Maquette/Resultats OYA (standalone).html`** → ouvrir d'un double-clic : page Résultats + modal email/RGPD + « Voir détails », responsive. C'est la référence visuelle exacte.
3. **`SPECS_AFFINAGE_CLAUCAU.md`** → la to-do priorisée (P1 bloquant → P3 nettoyage) pour les écrans non maquettés (Landing, Quiz, Peurs, Confirmation).

---

## ✅ Arbitrages verrouillés (rappel)

| Sujet | Décision |
|---|---|
| CTA | **#A85D08** (orange foncé) obligatoire — #EF8D11 réservé bordures/focus/accents |
| Titres / questions | H1 #424242 · H2/legend **#2E7D33** (vert foncé) |
| Vert clair #38AA3F | non-texte uniquement (cases, badges, icônes) |
| Q9 Peurs | cases **vertes** visibles + fond salmon #FFFBF8, 1 col mobile / 2 col ≥768 |
| Q3 / Q4 images | Q4 icône **au-dessus** (cartes) · Q3 icône **à gauche** (lignes) |
| Email | capturé **en fin** de parcours (modal sur Résultats) |
| Barre rank 3 | beige **#E8D4C8** (à valider à l'œil sur page réelle) |

---

## ⚠️ À câbler côté dev (ne pas oublier)

- **Bloc « Vos préoccupations identifiées »** : alimenté **dynamiquement** par les cases cochées en Q9 — dans la maquette il est en dur (mock).
- **Mock data Résultats** : structure `{ rank, métier, score, niveau, secteur, autonomie, pénurie, évolution, compétences }` (voir le brief §6) → brancher le backend.
- **Aucun cyan** : le cyan des PDF Visily est le thème par défaut de Visily, pas la marque OYA. Traduire en orange (action) / vert (validation).
