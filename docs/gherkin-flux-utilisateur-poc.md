# Gherkin — Flux utilisateur POC

**Scénario** : Un utilisateur complète le quiz d'orientation (10 questions) et reçoit son diagnostic

---

## Scénario : Parcours complet utilisateur

```gherkin
Fonctionnalité: Quiz d'orientation métier OYA
  Scénario: Utilisateur complète le quiz de 10 questions et reçoit son diagnostic

    Étant donné que je suis sur la page d'accueil du quiz OYA
    Et que je vois le design de la charte OYA
    Et que je suis prêt à répondre aux questions

    Quand je clique sur "Démarrer le quiz"
    Alors je vois la première question fermée

    Quand je réponds aux 10 questions fermées:
      | Question | Type | Exemple réponse |
      | Q1 : Ancien secteur d'activité | Choix multiples | Services |
      | Q2 : Niveau d'études | Sélecteur | Bac |
      | Q3 : Cadre de vie souhaité | Choix | Campagne / Urbain / Flexible |
      | Q4 : Ce qui vous attire | Cartes visuelles | Produire |
      | Q5 : Contraintes physiques/mobilité | Oui/Non | Non |
      | Q6 : Temps disponible reconversion | Sélecteur | 6-12 mois |
      | Q7 : Budget reconversion | Sélecteur | 5-15k |
      | Q8 : Expérience agriculture | Oui/Non | Oui |
      | Q9 : Peurs et préoccupations | Texte libre / Checkboxes | Manque de compétences |
      | Q10 : Région habitation | Sélecteur région | Bretagne |

    Alors chaque réponse est validée côté client
    Et je ne peux avancer qu'avec une réponse valide
    Et je vois une barre de progression (X/10)

    Quand j'ai répondu aux 10 questions
    Et que je clique sur "Voir mes résultats"
    Alors React fetch les 76 métiers depuis Google Sheet
    Et JavaScript calcule le score pour chaque métier:
      score_métier = Σ(match_i × poids_i) / Σ(poids_i) × 100
      où match_i ∈ {0, 0.5, 1} selon Q1-Q8 uniquement

    Et j'affiche les top 3 métiers avec:
      | Élément | Contenu |
      | Nom métier | Ex: "Maraîcher bio" |
      | Bloc/Famille | Ex: "Production agricole" |
      | Score | 0-100 (ex: 85) |
      | Pourquoi c'est un match | Phrase auto-générée du contexte |
      | Niveau qualification requis | "Bac" ou "BTS" |
      | 5 compétences clés | Liste (ex: "Autonomie, gestion sol, circuits courts") |

    Quand j'arrive à la page de résultats
    Alors je vois un bouton "Recevoir mon diagnostic par email"
    Et je dois remplir:
      - Champ email (requis, validé format)
      - Checkbox "Être tenu au courant des formations" (optionnel)

    Quand je saisis mon email
    Et je clique "Recevoir mon diagnostic"
    Alors je vois un formulaire pour le consentement RGPD

    Quand je vois le formulaire RGPD
    Alors je dois cocher:
      "J'accepte de recevoir mon diagnostic et que mes réponses 
       soient utilisées à titre statistique"
    Et ce checkbox est requis (je ne peux pas soumettre sans)

    Quand j'accepte le RGPD
    Et je clique "Envoyer"
    Alors React envoie un POST JSON vers Google Apps Script:
      {
        email: "user@example.com",
        Q1: "Services",
        Q2: "Bac",
        Q3: "Campagne",
        Q4: "Produire",
        Q5: "Non",
        Q6: "6-12 mois",
        Q7: "5-15k",
        Q8: "Oui",
        Q9: "Manque de compétences",
        Q10: "Bretagne",
        top_3_métiers: ["Maraîcher bio", "Logisticien agro", "Cuisinier bio"],
        scores: [85, 72, 68],
        bloc: "Production agricole",
        cadre_de_vie: "Campagne",
        region_habitee: "Bretagne",
        être_tenu_au_courant: true
      }

    Et Google Apps Script reçoit la requête
    Et envoie un email Brevo au candidat:
      Sujet: "Votre diagnostic L'Orienteur OYA"
      Body: 
        - Top 3 métiers avec scores
        - Compétences clés pour chacun
        - Prochaines étapes / formations OYA (placeholder)
        - Logo OYA + mention RGPD
    Et l'email arrive < 30 secondes après soumission

    Et Google Apps Script ajoute une nouvelle ligne 
        dans la feuille "Réponses" du Sheet avec:
      - Date/heure de soumission
      - Email utilisateur
      - Q1-Q10 (réponses complètes)
      - top_3_métiers (JSON ou texte)
      - Scores (JSON ou texte)
      - Bloc (métier top 1)
      - Cadre_de_vie (Q3)
      - Region_habitee (Q10)
      - être_tenu_au_courant (true/false)

    Quand la soumission est complète
    Alors je vois un message de confirmation:
      "Merci! Votre diagnostic a été envoyé à [email]"
    Et je peux retourner à l'accueil ou quitter

    Quand je teste la navigation clavier
    Alors:
      - Tab naviguer entre champs
      - Enter valider une réponse / aller à la question suivante
      - Escape quitter le quiz (avec confirmation)

    Quand je teste le responsive design
    Alors l'app s'affiche correctement sur:
      - Mobile (< 600px)
      - Tablet (600-1024px)
      - Desktop (> 1024px)

    Quand je teste l'accessibilité
    Alors:
      - Contraste texte/background ≥ 4.5:1
      - Tous les champs ont des labels explicites
      - Les couleurs ne sont jamais le seul moyen de comprendre
      - Compatible lecteur d'écran (NVDA/JAWS)
```

---

## Notes pour l'implémentation

- **Timing cible** : Parcours total < 5 minutes
- **Validation** : Côté client uniquement (pas d'appel serveur jusqu'à submit final)
- **Scoring** : Formule auditable (visible dans le code React). Q1-Q8 only, Q9-Q10 enregistrés mais pas scorés
- **Email** : Brevo API, avec fallback gracieux si envoi échoue
- **Sheet** : Utiliser `spreadsheets.batchUpdate` ou insert simple
- **A11y** : Lighthouse Accessibility ≥ 90
- **Tests** : Cypress ou Playwright pour le parcours complet
- **Q9 et Q10** : Enregistrés dans le Sheet pour que Boris analyse les patterns, mais n'impactent pas le scoring (Q1-Q8 only)

---

## Questions pour Claucau avant J1

Déjà tranchées dans le code existant ✅
