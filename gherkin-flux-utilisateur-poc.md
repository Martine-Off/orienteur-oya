# Gherkin — Flux utilisateur POC

**Scénario** : Un utilisateur complète le quiz d'orientation et reçoit son diagnostic

---

## Scénario : Parcours complet utilisateur

```gherkin
Fonctionnalité: Quiz d'orientation métier OYA
  Scénario: Utilisateur complète le quiz et reçoit son diagnostic

    Étant donné que je suis sur la page d'accueil du quiz OYA
    Et que je vois le design de la charte OYA
    Et que je suis prêt à répondre aux questions

    Quand je clique sur "Démarrer le quiz"
    Alors je vois la première question fermée

    Quand je réponds aux 8-10 questions fermées:
      | Question | Type | Exemple réponse |
      | Ancien secteur d'activité | Choix multiples | Services |
      | Niveau d'études | Sélecteur | Bac |
      | Région en France | Autocomplete | Île-de-France |
      | Ce qui vous attire | Cartes visuelles | Produire |
      | Contraintes physiques/mobilité | Oui/Non | Non |
      | Temps disponible reconversion | Sélecteur | 6-12 mois |
      | Budget reconversion | Sélecteur | 5-15k |
      | Expérience agriculture | Oui/Non | Oui |

    Alors chaque réponse est validée côté client
    Et je ne peux avancer qu'avec une réponse valide
    Et je vois une barre de progression (X/8)

    Quand j'ai répondu à toutes les questions
    Et que je clique sur "Voir mes résultats"
    Alors React fetch les 87 métiers depuis Google Sheet
    Et JavaScript calcule le score pour chaque métier:
      score_métier = Σ(réponse_i × poids_critère_i)

    Et j'affiche les top 3 métiers avec:
      | Élément | Contenu |
      | Nom métier | Ex: "Maraîcher bio" |
      | Bloc/Famille | Ex: "Production agricole" |
      | Score | 0-100 (ex: 85) |
      | Pourquoi c'est un match | Phrase auto-générée du contexte |
      | Niveau qualification requis | "Bac" ou "BTS" |
      | 3-5 compétences clés | Liste (ex: "Agroécologie, gestion sol, vente") |

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
        Q3: "Île-de-France",
        Q4: "Produire",
        Q5: "Non",
        Q6: "6-12 mois",
        Q7: "5-15k",
        Q8: "Oui",
        top_3_métiers: ["Maraîcher bio", "Logisticien agro", "Cuisinier bio"],
        scores: [85, 72, 68],
        région: "Île-de-France",
        bloc: "Production agricole",
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
      - Région
      - Bloc
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

## Notes pour Claucau

- **Timing cible** : Parcours total < 5 minutes
- **Validation** : Côté client uniquement (pas d'appel serveur jusqu'à submit final)
- **Scoring** : Formule doit être auditable (visible dans le code React)
- **Email** : Brevo API, avec fallback gracieux si envoi échoue
- **Sheet** : Utiliser `spreadsheets.batchUpdate` ou insert simple, peu importe
- **A11y** : Lighthouse Accessibility ≥ 90
- **Tests** : Cypress ou Playwright pour le parcours complet

**Questions pour Claudie avant J1** :
- Métiers : fetch à chaque question ou fetch une seule fois au mount?
- Pondérations : où vivent-elles (dans le Sheet ou dans le code React)?
- Email Brevo template : HTML ou texte simple?
- Cache métiers : localStorage ou juste state React?

Go! 🚀
