# Guide Boris — Analyse des données L'Orienteur OYA

## Accès au Sheet

Lien partagé : [ton lien]

Tu vois 3 onglets : **Métiers** | **Réponses** | **Analytics**

---

## Onglet "Réponses" — Voir les candidatures

Chaque ligne = 1 candidat qui a complété le quiz.

| Colonne | Signification |
|---|---|
| A: date_heure | Quand le quiz a été complété |
| B: email | Contact du candidat |
| C-L: Q1-Q10 | Ses 10 réponses |
| M-O: top_1/2/3_métier | Ses 3 métiers recommandés |
| P-R: score_1/2/3 | Scores de chaque métier (0-100) |
| S: bloc | Famille du métier (Production/Transformation/Distribution/etc) |
| T: cadre_de_vie | Sa préférence (Campagne/Urbain/Flexible) |
| U: region_habitee | Région où il vit |
| V: être_tenu_au_courant | T/F — il veut les infos formations |

### Exemple

Un candidat vient de Services (Q1), niveau Bac (Q2), préfère la Campagne (Q3)...

→ Recommandation : Maraîcher bio (score 85), Producteur fruits (78), Logisticien agro (71)

---

## Onglet "Analytics" — Analyser les patterns

### TCD 1 : Diagnostics par région

| Région | Nb |
|---|---|
| Bretagne | 7 |
| Île-de-France | 5 |
| Occitanie | 3 |

→ Bretagne = hotspot → lancer formations là-bas d'abord

### TCD 2 : Top 10 métiers demandés

| Métier | Nb |
|---|---|
| Maraîcher bio | 8 |
| Producteur fruits | 6 |
| Transformateur lait | 4 |

→ 50% veulent maraîchage → priorité formation maraîchage

### TCD 3 : Distribution par bloc

| Bloc | % |
|---|---|
| Production | 60% |
| Transformation | 25% |
| Distribution | 10% |
| Transversal | 5% |

→ Orientation claire vers production agricole

---

## Modifier les pondérations (affiner le matching)

**Scénario** : Tu trouves que "maraîchage" arrive trop souvent. Tu veux réduire son score.

### Étapes

1. Ouvre onglet **"Métiers"**
2. Trouve la ligne "Maraîcher bio"
3. Colonnes C-J = poids Q1-Q8
4. Exemple : réduis `poids_Q4` de `0.9` → `0.7` (produire compte moins)
5. **Sauvegarde**

### Résultat

- Les **nouveaux** candidats → scoring recalculé avec tes poids
- Les **anciens** candidats → inchangés (historique conservé ✅ RGPD)

---

## Segmenter pour mailing

Tu veux contacter les candidats de Bretagne qui veulent maraîchage ?

1. Colonne U (region_habitee) = "Bretagne"
2. Colonne M (top_1_métier) = "Maraîcher bio"
3. Filtre → copie les emails (colonne B)
4. Import dans mailList Brevo

---

## Troubleshooting

| Problème | Solution |
|---|---|
| Un candidat n'apparaît pas | Vérifier qu'il a cliqué "Envoyer" (pas juste "Voir résultats") |
| Scores bizarres | Vérifier pondérations colonne C-J → logique ? |
| Email pas reçu | Check junk + Brevo dashboard → "Statistiques" → "Rebonds" |
| Deux candidats même email | Autorisé — même personne peut relancer le quiz |

---

## Questions ?

Contact : [lien]
