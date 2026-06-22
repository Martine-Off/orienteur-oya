# Guide Boris — Analyse des données L'Orienteur OYA

## ⚠️ IMPORTANT : Données fictives (POC)

Les **20 diagnostics** du Sheet sont des **données de test/fictives**, créées pour valider le concept.
Ce ne sont **pas encore des vraies candidate·s**.

En production, vous recevrez des diagnostics réels de candidat·e·s qui auront complété le quiz sur la vraie app.

---

## C'est quoi, un POC ?

**POC = Proof of Concept (Preuve de Concept)**

Un POC, c'est un **petit projet rapide** pour tester une idée **avant d'y investir gros**.

**Pourquoi un POC pour L'Orienteur OYA ?**

Avant de dépenser des ressources massives sur une plateforme de formation complète, vous vouliez vérifier :
- ✅ Le concept d'un quiz d'orientation fonctionne?
- ✅ Les candidate·s intéressé·e·s répondent?
- ✅ Les métiers proposés font du sens?
- ✅ Les données collectées sont utiles pour prioriser vos formations?

**Le POC en 3 jours** = répondre à ces questions avec **données fictives d'abord**, pour être sûr avant de lancer en vrai.

**Maintenant (fin POC)** :
- ✅ L'app fonctionne de bout en bout
- ✅ Les TCDs et graphiques affichent les insights
- ✅ Vous pouvez voir comment les données arrivent
- ⏭️ **Prochaine étape** : lancer avec des **vraies candidate·s** (test réel)

---

## Accès au Sheet

Lien partagé : [https://docs.google.com/spreadsheets/d/1Qy1fYOnCBFZHMHwu0RZ2n5-wI8_RZDsQ3YmUuG0QF-s/edit](https://docs.google.com/spreadsheets/d/1Qy1fYOnCBFZHMHwu0RZ2n5-wI8_RZDsQ3YmUuG0QF-s/edit)

Vous verrez **7 onglets** : Métiers | Réponses | Top métiers | Top domaines | Domaine × Région | Cadre de vie × Région | Domaines dépliés

---

## 📊 État du POC (20 diagnostics)

| Métrique | Valeur |
|---|---|
| **Candidate·s** | 20 |
| **Top métier** | Artisan·e métiers de bouche (6 recommandations = 10%) |
| **Top domaine** | Nutrition santé & consommation (11 = 18%) |
| **Région prioritaire** | Bretagne (9 diagnostics) |
| **Cadre de vie dominant** | Campagne (8 candidate·s) |
| **Consentement newsletter** | 11 confirmé·e·s (55%) |

---

## Onglet "Réponses" — Consulter les candidate·s

Chaque ligne = 1 candidate qui a complété le quiz.

| Colonne | Signification |
|---|---|
| A: Timestamp | Quand complété |
| B: Email | Contact candidate |
| C-K: Q1-Q9 | 9 réponses fermées + texte |
| L: Q10 Région | Région habitée |
| M-O: Domaine 1/2/3 | Familles recommandées |
| P-R: Métier 1/2/3 | Métiers exacts |
| S-U: Score 1/2/3 | Scores 0-100 |
| V: Newsletter OYA | VRAI/FAUX |

### Exemple réel

**Alice** (Bretagne, Production/Technique, Campagne) :
- Recommandation #1 : **Maraîcher·ère bio** (Score 88) — Production agricole
- Recommandation #2 : **Artisan·e métiers de bouche** (Score 74) — Transformation
- Recommandation #3 : **Responsable logistique circuits courts** (Score 61) — Logistique

→ Alice a confirmé son consentement newsletter ✅ → À ajouter à votre liste mailing Brevo

---

## 📈 Onglet "Analytics" — Insights clés

### TCD 1 : Top 10 métiers (tous les diagnostics)

| Métier | Nb | % |
|---|---|---|
| Artisan·e métiers de bouche | 6 | 10% |
| Responsable supply chain | 5 | 8% |
| Maraîcher·ère / maraîcher·ère bio | 4 | 7% |
| Responsable restauration collective durable | 4 | 7% |
| Consultant·e transition alimentaire | 4 | 7% |
| Diététicien·ne / nutritionniste | 4 | 7% |
| Cuisinier·ère / Chef·fe cuisinier·ère | 4 | 7% |
| Éleveur·euse | 3 | 5% |
| Data analyste agro/agri | 3 | 5% |
| Chef·fe de projet alimentation durable | 3 | 5% |

**📌 Insight** : Métiers de bouche + supply chain + nutrition = 50% de la demande → **À prioriser pour les formations**

---

### TCD 2 : Top domaines

| Domaine | Nb | % |
|---|---|---|
| **Nutrition santé & consommation** | **11** | **18%** |
| **Logistique distribution** | **10** | **17%** |
| Production agricole | 9 | 15% |
| Transformation agroalimentaire | 9 | 15% |
| Restauration et métiers de bouche | 8 | 13% |

**📌 Insight** : Nutrition domine → **Formations diététique/santé alimentaire très demandées**

---

### TCD 3 : Domaines × Région (GRAPHIQUE CLÉ)

**Bretagne** (9 diagnostiques) :
- Production agricole : 2
- Transformation : 2
- Logistique : 2
- Restauration : 1
- Nutrition : 1
- Transversal : 1

→ **Bretagne = production agricole + transformation**

**Île-de-France** (6 diagnostiques) :
- Nutrition : 2 (dominant)
- Logistique : 1
- Production : 1
- Transversal : 2

→ **Île-de-France = nutrition + transversal (cadres)**

**Occitanie** (6 diagnostiques) :
- Tous domaines représentés équitablement

→ **Occitanie = équilibré, demande diversifiée**

---

### TCD 4 : Cadre de vie × Région

| Région | Campagne | Urbain | Flexible | Total |
|---|---|---|---|---|
| **Bretagne** | **2** | 1 | — | 3 |
| **Normandie** | 2 | — | — | 2 |
| **Auvergne-Rhône-Alpes** | — | 2 | — | 2 |
| **Île-de-France** | — | 1 | 1 | 2 |
| Autres régions | 4 | 2 | 4 | 10 |
| **Total** | **8** | **6** | **6** | **20** |

**📌 Insight** : Bretagne/Normandie/Auvergne = très rural. Île-de-France = mixte urbain/flexible.

---

## 🎯 Recommandations de lancement

### Priorité 1 : FORMATION NUTRITION (18% de la demande)

**Candidate·s** : Rachel (Auvergne), Laura (Nouvelle-Aquitaine), Celine (Occitanie) + 8 autres
- **Niveau requis** : Bac+3 minimum → BTS/Licence nutrition
- **Régions prioritaires** : Île-de-France (2), Auvergne-Rhône-Alpes (2)
- **Action proposée** : Lancer **diététique/conseiller·ère alimentation durable** en Île-de-France + Auvergne

### Priorité 2 : ARTISANAT / MÉTIERS DE BOUCHE (10%)

**Candidate·s** : David, Igor, Nadia, Samuel + 2 autres
- **Niveau requis** : CAP/BEP → compétence artisanale
- **Régions prioritaires** : Bretagne (4), Normandie (1), Provence (1)
- **Action proposée** : **Formations boulanger·ère/boucher·ère/cuisinier·ère** en Bretagne

### Priorité 3 : AGRICULTURE / PRODUCTION (15%)

**Candidate·s** : Alice, François, Kevin, Pauline + 5 autres
- **Niveau requis** : CAP/BEP → BPREA (reconversion)
- **Régions prioritaires** : Bretagne (2), Normandie (2), Occitanie (1)
- **Action proposée** : **BPREA maraîchage** en Bretagne ; **élevage** Normandie

### Priorité 4 : LOGISTIQUE / SUPPLY CHAIN (17%)

**Candidate·s** : Emma, Julie, Olivier, Thérese + 6 autres
- **Niveau requis** : Bac → Bac+2 manager
- **Régions** : Partout (Île-de-France, Hauts-de-France, Auvergne)
- **Action proposée** : **Formations logistique durable** (bas-carbone, circuits courts)

---

## 🎣 Segmentation pour mailing Brevo

### Comment extraire la liste newsletter ?

1. Onglet **"Réponses"**
2. Filtrez colonne **V (Newsletter OYA)** = **VRAI**
3. Sélectionnez colonne **B (Email)** des lignes filtrées
4. Copiez → collez dans votre liste Brevo

### Segment 1 : "Nutrition débutant·e·s"
**Filtre** : Domaine 1 = Nutrition OU Nutrition en top 2/3 + Q2 (Niveau) ≤ Bac

Candidate·s : Celine, Gael, Laura, Rachel, Emma
**Action** : Email → "Formation BTS Nutrition commençant septembre"

### Segment 2 : "Production agricole Bretagne"
**Filtre** : Région = Bretagne + Métier contient "Maraîcher/Éleveur/Agriculteur"

Candidate·s : Alice, Olivier + potentiel·le·s
**Action** : Email → "BPREA Maraîchage bio Bretagne"

### Segment 3 : "Métiers de bouche — Apprentissage"
**Filtre** : Métier contient "Artisan/Boulanger/Boucher/Cuisinier" + Q6 (Temps) = "< 6 mois"

Candidate·s : David, Igor, Samuel + potentiel·le·s
**Action** : Email → "CAP Boulangerie — Entrée rapide"

### Segment 4 : "Supply chain + Durabilité"
**Filtre** : Métier = "Supply chain/Logistique" + Domaine = "Logistique distribution"

Candidate·s : Emma, Julie, Olivier, Thérese, Quentin
**Action** : Email → "Master Supply Chain Durable"

---

## 📝 Modifier les pondérations (affiner le scoring)

Si vous trouvez que certain·e·s métiers arrivent trop/pas assez souvent :

1. Onglet **"Métiers"**
2. Trouvez la ligne (ex: "Artisan métiers de bouche")
3. Colonnes **Poids_Q1 à Poids_Q8** = ajustez (0 = pas important, 1 = très important)
   - Exemple : réduire **Poids_Q4** (ce qui attire) de 0.9 → 0.7
4. **Sauvegardez**

**Résultat** :
- ✅ **Nouveau·elle·s** candidate·s → scoring recalculé
- ✅ **Ancien·ne·s** candidate·s → inchangé·e·s (RGPD)

---

## 🔍 Troubleshooting

| Problème | Solution |
|---|---|
| Une candidate n'apparaît pas | Vérifier qu'elle a cliqué "Envoyer" (pas juste "Voir résultats") |
| Scores bizarres pour un métier | Onglet Métiers → vérifier Poids_Q1-Q8 |
| Email pas reçu (mais dans Réponses) | Check dossier junk + Brevo → "Statistiques" → "Bounces" |
| Même email 2 fois | Autorisé·e — candidate peut refaire le quiz |
| Export newsletter difficile | Voir section "Segmentation pour mailing" ci-dessus |

---

## 📞 Questions ?

Contact : martine.desmaroux@eisf.fr

**Docs utiles** :
- GUIDE_CANDIDAT.md → à envoyer aux candidate·s
- README-TECHNIQUE.md → si vous développez l'app en vrai
