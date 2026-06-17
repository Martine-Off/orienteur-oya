# Guide Boris — Ajuster les pondérations et les métiers

Ce guide explique comment modifier les poids de scoring et les données métiers **sans toucher au code**.

---

## Comprendre les pondérations

Chaque métier a 8 poids (Q1 à Q8), entre 0 et 1, qui déterminent l'importance de chaque question dans le calcul de compatibilité.

**Formule :**
```
score = Σ(match_i × poids_i) / Σ(poids_i) × 100
```

**Exemple :**
- `Poids_Q4 = 0.9` → la question "Ce qui attire" a un fort impact sur ce métier
- `Poids_Q2 = 0.2` → le niveau d'études compte peu pour ce métier
- `Poids_Q2 = 0.0` → le niveau d'études est ignoré pour ce métier

**Valeurs recommandées :**

| Valeur | Interprétation |
|---|---|
| `0.0` | Question ignorée (sans influence) |
| `0.3` | Faible influence |
| `0.6` | Influence modérée (valeur par défaut) |
| `0.8` | Forte influence |
| `1.0` | Influence maximale |

---

## Étape 1 — Ouvrir le Google Sheet

Ouvrir le Google Sheet du projet → onglet **Métiers**.

Chaque ligne = un métier. Les colonnes de pondération sont :

| Colonne | Question | Ce qu'elle mesure |
|---|---|---|
| `Poids_Q1` | Secteur d'origine | Cohérence avec le type d'activité du métier |
| `Poids_Q2` | Niveau d'études | Niveau minimum requis |
| `Poids_Q3` | Cadre de vie | Localisation (urbain / campagne / flexible) |
| `Poids_Q4` | Ce qui attire | Attrait pour l'activité + relation au vivant |
| `Poids_Q5` | Contraintes physiques | Pénibilité du métier |
| `Poids_Q6` | Temps disponible | Non utilisé dans le score (toujours `0`) |
| `Poids_Q7` | Budget | Situation financière nécessaire |
| `Poids_Q8` | Expérience agriculture | Bonus pour métiers agricoles / en tension |

---

## Étape 2 — Modifier les poids

1. Dans l'onglet **Métiers**, trouver la ligne du métier à ajuster
2. Modifier la valeur dans la colonne concernée (entre `0.0` et `1.0`)
3. Répéter pour chaque métier si nécessaire

> **Conseil** : commencer par ajuster Q4 (Ce qui attire, poids fort) et Q1 (Secteur d'origine). Ces deux questions ont le plus d'impact sur la recommandation.

---

## Étape 3 — Propager les changements

Les poids sont stockés dans deux endroits :

### Option A — Modification légère (test rapide)
Modifier directement dans le Sheet. L'Apps Script utilisera les nouvelles valeurs au prochain POST.  
→ Les poids du Sheet ne sont **pas** lus dynamiquement par le frontend. Pour que les utilisateurs voient les nouveaux résultats, il faut aussi mettre à jour `public/metiers.json` (Option B).

### Option B — Propagation complète (recommandée)
1. Exporter l'onglet **Métiers** en CSV : **Fichier → Télécharger → CSV**
2. Remplacer le fichier `CSV_87_Metiers_OYA_V2_Niveau_MIN.csv` dans le repo
3. Depuis `C:\dev\orienteur-oya`, lancer :
   ```bash
   npm run build:metiers
   ```
   Cela régénère `public/metiers.json` avec les nouveaux poids.
4. Commit + push → Netlify redéploie automatiquement

---

## Modifier un métier existant

Les colonnes disponibles dans l'onglet Métiers :

| Colonne | Rôle | Valeurs acceptées |
|---|---|---|
| `Métier` | Nom affiché à l'utilisateur | Texte libre |
| `Bloc` | Thématique de regroupement | "Production agricole", "Transformation alimentaire", etc. |
| `Statut` | Badge affiché sur la carte | "Émergent", "Tension", "Stable" |
| `Niveau_MIN` | Niveau d'études requis | 3 (CAP), 4 (Bac), 5 (BTS), 6 (Licence), 7 (Master) |
| `Type activité` | Type principal d'activité | "Piloter", "Produire", "Transformer", "Former", "Analyser" |
| `Relation vivant` | Relation au monde vivant | "Plantes", "Animaux", "Management", "Tech" |
| `Localisation` | Zone géographique | "Urbain", "Campagne", "Flexible" (séparés par `/`) |
| `Situation` | Situation financière nécessaire | "Zéro", "Terrain", "Capital" |
| `Intentions clés` | Compétences clés affichées | Séparées par ` - ` |
| `Formations prioritaires` | Parcours de formation recommandé | Texte libre |
| `Thématique formation` | Description courte du métier | Texte libre |

---

## Ajouter un nouveau métier

1. Ajouter une ligne dans l'onglet **Métiers** avec toutes les colonnes remplies
2. Renseigner les 8 poids (copier les valeurs d'un métier similaire comme point de départ)
3. Suivre l'Option B ci-dessus pour propager

---

## Questions ?

Contacter Martine : m.desmaroux@eisf.fr
