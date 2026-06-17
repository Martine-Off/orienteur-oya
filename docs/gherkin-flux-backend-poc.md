# Gherkin — Flux backend POC (Boris analytics)

**Scénario** : Boris accède au Google Sheet et voit les données collectées + TCDs pré-construits

---

## Scénario : Boris analyse les patterns de marché

```gherkin
Fonctionnalité: Analytics et consultation des données pour OYA
  Scénario: Boris consulte les patterns de marché via TCDs pré-construits

    Étant donné que 10+ utilisateurs ont complété le quiz OYA
    Et que leurs réponses sont enregistrées dans la feuille "Réponses" 
        du Google Sheet
    Et que des TCDs pré-construits existent dans la feuille "Analytics"

    Quand Boris ouvre le Google Sheet
    Alors il voit 3 onglets:
      - "Métiers" : 87 métiers + pondérations (modifiable)
      - "Réponses" : chaque lead enregistré
      - "Analytics" : TCDs et formules

    Quand Boris consulte l'onglet "Réponses"
    Alors il voit toutes les colonnes:
      | Colonne | Type | Exemple |
      | date_heure | Timestamp | 2026-06-17 10:30:45 |
      | email | Texte | user@example.com |
      | Q1_secteur | Choix | Services |
      | Q2_niveau | Choix | Bac |
      | Q3_région | Texte | Île-de-France |
      | Q4_attire | Choix | Produire |
      | Q5_contraintes | Oui/Non | Non |
      | Q6_temps | Choix | 6-12 mois |
      | Q7_budget | Choix | 5-15k |
      | Q8_agri | Oui/Non | Oui |
      | top_1_métier | Texte | Maraîcher bio |
      | top_2_métier | Texte | Logisticien agro |
      | top_3_métier | Texte | Cuisinier bio |
      | score_1 | Nombre | 85 |
      | score_2 | Nombre | 72 |
      | score_3 | Nombre | 68 |
      | région_inférée | Texte | Île-de-France |
      | bloc | Texte | Production agricole |
      | être_tenu_au_courant | Booléen | TRUE |

    Quand Boris consulte l'onglet "Analytics"
    Alors il voit les TCDs pré-construits:

      TCD 1: Nombre de diagnostics par région
        - Formule : COUNTIF(Réponses!C:C, "Île-de-France")
        - Affichage : Histogramme vertical
        - Filtrable : par région

      TCD 2: Top 10 métiers recommandés (tous les diagnostics)
        - Formule : COUNTIF(Réponses!J:J, "Maraîcher bio")
        - Affichage : Histogramme horizontal
        - Résultat exemple : 
            Maraîcher bio: 7 diagnostics
            Logisticien agro: 5 diagnostics
            Cuisinier bio: 3 diagnostics

      TCD 3: Distribution profils par bloc/famille
        - Formule : COUNTIF(Réponses!O:O, "Production agricole")
        - Affichage : Pie chart ou histogramme empilé
        - Catégories : Production, Transformation, Distribution, Cuisines

      TCD 4 (BONUS): Budget vs région
        - Formule : Tableau croisé dynamique
        - Affichage : Heatmap
        - Insight : "Quel budget par région?"

    Quand Boris veut analyser les données
    Alors il peut:
      - Copier/coller un TCD dans un email aux collectivités
      - Exporter un TCD en PNG via Sheet (save as image)
      - Filtrer la feuille "Réponses" par région/métier/profil
      - Calculer des moyennes (âge moyen, budget moyen, etc)
        via formules simples (AVERAGE, SUMIF, etc)

    Quand Boris regarde le TCD "Top 10 métiers"
    Alors il peut voir immédiatement:
      - "70% des diagnostics recommandent maraîchage bio"
      - "Île-de-France = hotspot pour maraîchage"
      - "Distribution = très peu de demande"

    Quand Boris fait du profiling utilisateur
    Alors il peut répondre:
      - "Quel est le profil type qui demande maraîchage?"
        → Filtrer Réponses par top_1_métier = "Maraîcher"
        → Regarder Q1-Q8 (secteur, niveau, région, budget, etc)
      - "Combien viennent de Paris?" 
        → Filtrer région = "Paris", compter lignes
      - "Quel budget moyen?"
        → AVERAGE(Q7_budget) pour tous leads

    Quand Boris voit les patterns
    Alors il peut prioriser le lancement:
      "70% en Île-de-France + 85% score moyen pour maraîchage 
       → Lance formation maraîchage en IDF en priorité"

    Quand Boris veut vendre les données aux collectivités
    Alors il peut dire:
      - "Selon notre diagnostic d'orientation (N=50 candidats)"
      - "Les 3 métiers les plus demandés sont : [top 3]"
      - "Profil type : [secteur moyen], [budget moyen], [région]"
      - "Hotspot régional : [région] avec X% de demande"

    Quand Boris ajuste les pondérations
    Alors il:
      - Ouvre l'onglet "Métiers"
      - Change les poids pour certains métiers/questions
      - Ré-lance le quiz avec nouvelles pondérations
      - Les futurs diagnostics utilisent les new poids
      - Historique (anciens leads) ne change pas

    Quand Boris veut comparer avant/après ajustement
    Alors il:
      - Crée une copie du Sheet ("Réponses_v1" vs "Réponses_v2")
      - Ou filtre par date (FILTER(Réponses!A:O, A:A > "2026-06-18"))

    Quand un utilisateur demande "Être tenu au courant"
    Alors Boris voit TRUE dans la colonne "être_tenu_au_courant"
    Et il peut extraire la liste d'emails pour mailing ou segmentation

    Quand le POC tourne depuis 3 jours
    Alors Boris a:
      - 15-20 diagnostics en moyenne
      - 5-10 métiers différents recommandés
      - 2-3 régions représentées
      - Des patterns clairs (ou pas)
      - Une base pour préparer V2 du quiz
```

---

## Structure Google Sheet (POC)

```
Onglet "Métiers" (source de vérité)
├── Colonne A : Métier (ex: "Maraîcher bio")
├── Colonne B : Bloc (ex: "Production agricole")
├── Colonne C : Poids_Q1_secteur (ex: 0.8)
├── Colonne D : Poids_Q2_niveau (ex: 0.6)
├── ... (Poids pour Q3-Q8)
├── Colonne J : Compétences_clés (ex: "Agroécologie, gestion sol")
└── Colonne K : Niveau_qualification (ex: "Bac")

Onglet "Réponses" (leads collectés)
├── Colonne A : date_heure
├── Colonne B : email
├── Colonnes C-J : Q1-Q8 (réponses utilisateur)
├── Colonnes K-M : top_1/2/3_métier
├── Colonnes N-P : score_1/2/3
├── Colonne Q : région_inférée
├── Colonne R : bloc
└── Colonne S : être_tenu_au_courant

Onglet "Analytics" (TCDs pré-construits)
├── Tableau 1 : Nombre diagnostics par région
│   └── Formule : COUNTIF(Réponses!Q:Q, "Île-de-France")
├── Tableau 2 : Top 10 métiers
│   └── Formule : COUNTIF(Réponses!K:K, "Maraîcher bio")
├── Tableau 3 : Distribution blocs
│   └── Formule : COUNTIF(Réponses!R:R, "Production")
└── Tableau 4 (bonus) : Budget vs région
    └── Formule : Tableau croisé
```

---

## Notes pour Claucau

- **Sheet ID** : Martine la donne J0
- **Pondérations** : Claucau fetch depuis Métiers!C:K au démarrage de l'app
- **Insertion Réponses** : Google Apps Script `spreadsheets.appendValues()` ou batchUpdate
- **TCDs** : Formules simples COUNTIF/SUMIF, pas de charts avancés (V2)
- **Authentification Sheet** : Via Google App Script doPost(e), pas OAuth côté React

**Question pour Claudie** :
- TCDs : on met les formules/charts dans Analytics, ou juste les données brutes et Boris les crée?
- Réponse POC : Juste formules simples COUNTIF. Charts = V2 ou Boris les crée manuellement.

Go! 🚀
