# Gherkin — Flux backend POC (Boris analytics)

**Scénario** : Boris accède au Google Sheet et voit les données collectées + TCDs pré-construits

---

## Scénario : Boris analyse les patterns de marché

```gherkin
Fonctionnalité: Analytics et consultation des données pour OYA
  Scénario: Boris consulte les patterns de marché via TCDs pré-construits

    Étant donné que 10+ utilisateurs ont complété le quiz OYA de 10 questions
    Et que leurs réponses sont enregistrées dans la feuille "Réponses" 
        du Google Sheet
    Et que des TCDs pré-construits existent dans la feuille "Analytics"

    Quand Boris ouvre le Google Sheet
    Alors il voit 3 onglets:
      - "Métiers" : 76 métiers + pondérations Q1-Q8 (modifiable)
      - "Réponses" : chaque lead enregistré
      - "Analytics" : TCDs et formules

    Quand Boris consulte l'onglet "Réponses"
    Alors il voit toutes les colonnes:
      | Colonne | Type | Exemple |
      | date_heure | Timestamp | 2026-06-17 10:30:45 |
      | email | Texte | user@example.com |
      | Q1_secteur | Choix | Services |
      | Q2_niveau | Choix | Bac |
      | Q3_cadre_de_vie | Choix | Campagne |
      | Q4_attire | Choix | Produire |
      | Q5_contraintes | Oui/Non | Non |
      | Q6_temps | Choix | 6-12 mois |
      | Q7_budget | Choix | 5-15k |
      | Q8_agri | Oui/Non | Oui |
      | Q9_peurs | Texte | Manque de compétences |
      | Q10_region_habitee | Texte | Bretagne |
      | top_1_métier | Texte | Maraîcher bio |
      | top_2_métier | Texte | Logisticien agro |
      | top_3_métier | Texte | Cuisinier bio |
      | score_1 | Nombre | 85 |
      | score_2 | Nombre | 72 |
      | score_3 | Nombre | 68 |
      | bloc | Texte | Production agricole |
      | cadre_de_vie | Texte | Campagne |
      | region_habitee | Texte | Bretagne |
      | être_tenu_au_courant | Booléen | TRUE |

    Quand Boris consulte l'onglet "Analytics"
    Alors il voit les TCDs pré-construits:

      TCD 1: Nombre de diagnostics par région
        - Formule : COUNTIF(Réponses!R:R, "Bretagne")
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
        - Formule : COUNTIF(Réponses!N:N, "Production agricole")
        - Affichage : Pie chart ou histogramme empilé
        - Catégories : Production, Transformation, Distribution, Restauration, Transversal

      TCD 4 (BONUS): Cadre de vie vs région habitée
        - Formule : Tableau croisé dynamique
        - Affichage : Tableau croisant cadre_de_vie (Q3) × region_habitee (Q10)
        - Insight : "Quel candidat veut quel cadre de vie dans quelle région?"

    Quand Boris veut analyser les données
    Alors il peut:
      - Copier/coller un TCD dans un email aux collectivités
      - Exporter un TCD en PNG via Sheet (save as image)
      - Filtrer la feuille "Réponses" par région/métier/profil
      - Calculer des moyennes (budget moyen, temps moyen, etc)
        via formules simples (AVERAGE, SUMIF, etc)

    Quand Boris regarde le TCD "Top 10 métiers"
    Alors il peut voir immédiatement:
      - "70% des diagnostics recommandent maraîchage bio"
      - "Île-de-France = hotspot pour maraîchage"
      - "Restauration = très peu de demande"

    Quand Boris fait du profiling utilisateur
    Alors il peut répondre:
      - "Quel est le profil type qui demande maraîchage?"
        → Filtrer Réponses par top_1_métier = "Maraîcher"
        → Regarder Q1-Q10 (secteur, niveau, cadre de vie, budget, peurs, région, etc)
      - "Combien viennent de Bretagne?" 
        → Filtrer region_habitee = "Bretagne", compter lignes
      - "Quel budget moyen?"
        → AVERAGE(Q7_budget) pour tous leads
      - "Quels types de peurs?" 
        → Filtrer Q9_peurs, compter occurrences

    Quand Boris voit les patterns
    Alors il peut prioriser le lancement:
      "70% en Île-de-France + 85% score moyen pour maraîchage 
       + demande croissante de "Campagne" (Q3)
       → Lance formation maraîchage en IDF (milieu rural) en priorité"

    Quand Boris veut vendre les données aux collectivités
    Alors il peut dire:
      - "Selon notre diagnostic d'orientation (N=50 candidats)"
      - "Les 3 métiers les plus demandés sont : [top 3]"
      - "Profil type : [secteur moyen], [budget moyen], cadre de vie [moyen], région [chaude]"
      - "Hotspot régional : [région] avec X% de demande"
      - "Peur principale : [peur la plus fréquente]"

    Quand Boris ajuste les pondérations (Q1-Q8)
    Alors il:
      - Ouvre l'onglet "Métiers"
      - Change les poids pour certains métiers/questions
      - Ré-lance le quiz avec nouvelles pondérations
      - Les futurs diagnostics utilisent les new poids
      - Historique (anciens leads) ne change pas

    Quand Boris veut comparer avant/après ajustement
    Alors il:
      - Crée une copie du Sheet ("Réponses_v1" vs "Réponses_v2")
      - Ou filtre par date (FILTER(Réponses!A:Z, A:A > "2026-06-18"))

    Quand un utilisateur demande "Être tenu au courant"
    Alors Boris voit TRUE dans la colonne "être_tenu_au_courant"
    Et il peut extraire la liste d'emails pour mailing ou segmentation

    Quand le POC tourne depuis 3 jours
    Alors Boris a:
      - 15-20 diagnostics en moyenne
      - 5-10 métiers différents recommandés
      - 2-3 régions représentées
      - Des patterns clairs sur les peurs principales
      - Une base pour préparer V2 du quiz avec données réelles
```

---

## Structure Google Sheet (POC)

```
Onglet "Métiers" (source de vérité)
├── Colonne A : Métier (ex: "Maraîcher bio")
├── Colonne B : Bloc (ex: "Production agricole")
├── Colonne C : Poids_Q1_secteur (ex: 0.8)
├── Colonne D : Poids_Q2_niveau (ex: 0.6)
├── Colonne E : Poids_Q3_cadre_de_vie (ex: 0.85)
├── ... (Poids pour Q4-Q8)
├── Colonne K : Compétences_clés (ex: "Agroécologie, gestion sol, autonomie")
├── Colonne L : Niveau_qualification (ex: "Bac")
├── Colonne M : Secteur (ex: "Fruits/Légumes")
├── Colonne N : Type_métier (ex: "Produire")
├── Colonne O : Pénurie (ex: "En tension")
├── Colonne P : Évolution (ex: "Traditionnel")
└── Colonne Q : Formations_prioritaires (ex: "BPREA, CAP Maraîchage")

Onglet "Réponses" (leads collectés)
├── Colonne A : date_heure
├── Colonne B : email
├── Colonnes C-L : Q1-Q10 (réponses utilisateur complètes)
├── Colonnes M-O : top_1/2/3_métier
├── Colonnes P-R : score_1/2/3
├── Colonne S : bloc (du métier top 1)
├── Colonne T : cadre_de_vie (Q3)
├── Colonne U : region_habitee (Q10)
└── Colonne V : être_tenu_au_courant

Onglet "Analytics" (TCDs pré-construits)
├── Tableau 1 : Nombre diagnostics par région
│   └── Formule : COUNTIF(Réponses!U:U, "Bretagne")
├── Tableau 2 : Top 10 métiers
│   └── Formule : COUNTIF(Réponses!M:M, "Maraîcher bio")
├── Tableau 3 : Distribution blocs
│   └── Formule : COUNTIF(Réponses!S:S, "Production")
└── Tableau 4 (bonus) : Cadre de vie vs Région
    └── Formule : Tableau croisé cadre_de_vie (T) × region_habitee (U)
```

---

## Notes pour Claucau

- **Sheet ID** : Martine la donne J0
- **Pondérations** : Claucau fetch depuis Métiers!C:J au démarrage de l'app (Q1-Q8 only)
- **Insertion Réponses** : Google Apps Script `spreadsheets.appendValues()` avec 10 questions (Q1-Q10)
- **TCDs** : Formules simples COUNTIF/SUMIF, pas de charts avancés (V2)
- **Authentification Sheet** : Via Google App Script doPost(e), pas OAuth côté React
- **Scoring** : Q1-Q8 only — Q9 et Q10 enregistrés pour analyse, pas de pondérations

**Note importante** :
- Q3 (cadre_de_vie) et Q10 (region_habitee) sont deux dimensions différentes
- Q3 = "Campagne" / "Urbain" / "Flexible" (préférence mode de vie)
- Q10 = "Bretagne" / "Île-de-France" / etc (région géographique réelle)
- Boris a besoin des deux pour profiler correctement
