describe("Quiz d'orientation OYA", () => {
  function repondreAuQuiz() {
    cy.contains("Démarrer le diagnostic").click();

    // Q1 — secteur (choix)
    cy.contains("label", "Management/Encadrement").click();
    cy.contains("button", "Suivant").click();

    // Q2 — niveau études (chips)
    cy.contains("label", "BTS / BTSA").click();
    cy.contains("button", "Suivant").click();

    // Q3 — cadre de vie (cartes, icon gauche)
    cy.contains("label", "Urbain").click();
    cy.contains("button", "Suivant").click();

    // Q4 — attraits (cartes)
    cy.contains("label", "Produire / cultiver").click();
    cy.contains("button", "Suivant").click();

    // Q5 — contraintes physiques (oui/non)
    cy.contains("label", "Non").click();
    cy.contains("button", "Suivant").click();

    // Q6 — temps disponible (chips)
    cy.contains("label", "6-12 mois").click();
    cy.contains("button", "Suivant").click();

    // Q7 — budget (chips)
    cy.contains("label", "5-15k").click();
    cy.contains("button", "Suivant").click();

    // Q8 — expérience agriculture (oui/non)
    cy.contains("label", "Oui").click();
    cy.contains("button", "Suivant").click();

    // Q9 — peurs (checkboxes vertes)
    cy.contains("label", "Chômage").click();
    cy.contains("button", "Suivant").click();

    // Q10 — région (select)
    cy.get("#Q10").select("Île-de-France");
    cy.contains("button", "Voir mes résultats").click();
  }

  it("complète le parcours quiz -> résultats -> email modal -> confirmation", () => {
    cy.visit("/");
    repondreAuQuiz();

    // Page résultats — 3 cartes de résultats
    cy.contains("Votre diagnostic personnalisé").should("be.visible");
    cy.get(".result-card").should("have.length", 3);
    cy.get(".result-card--rank1").should("have.length", 1);

    // Ouvrir le modal email
    cy.contains("Recevoir mon diagnostic par email").click();
    cy.get("#modal-email").type("test@example.com");
    cy.get("#modal-rgpd").check();
    cy.contains("button", "Envoyer mon diagnostic").click();

    // Confirmation inline (dans la page résultats)
    cy.contains("Diagnostic envoyé à test@example.com").should("be.visible");
  });

  it("empêche d'avancer sans répondre à une question (validation côté client)", () => {
    cy.visit("/quiz");
    cy.contains("button", "Suivant").should("be.disabled");
    cy.contains("label", "Management/Encadrement").click();
    cy.contains("button", "Suivant").should("not.be.disabled");
  });

  it("affiche une barre de progression cohérente", () => {
    cy.visit("/quiz");
    cy.contains("1/10").should("be.visible");
    cy.contains("label", "Management/Encadrement").click();
    cy.contains("button", "Suivant").click();
    cy.contains("2/10").should("be.visible");
  });

  it("requiert le consentement RGPD avant l'envoi (bouton désactivé)", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.contains("Recevoir mon diagnostic par email").click();
    cy.get("#modal-email").type("test@example.com");
    // Sans cocher RGPD, le bouton doit être désactivé
    cy.contains("button", "Envoyer mon diagnostic").should("be.disabled");
  });

  it("requiert un email valide (message d'erreur après submit)", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.contains("Recevoir mon diagnostic par email").click();
    cy.get("#modal-email").type("pas-un-email");
    cy.get("#modal-rgpd").check();
    // Bouton activé (RGPD coché) mais email invalide → clic déclenche l'erreur
    cy.contains("button", "Envoyer mon diagnostic").should("not.be.disabled").click();
    cy.contains("Format email incorrect").should("be.visible");
  });

  it("permet de revenir en arrière dans le quiz (bouton Précédent)", () => {
    cy.visit("/quiz");
    cy.contains("label", "Management/Encadrement").click();
    cy.contains("button", "Suivant").click();
    cy.contains("button", "Précédent").click();
    cy.contains("1/10").should("be.visible");
  });

  it("expose des options accessibles au clavier (radios natifs, focusables)", () => {
    cy.visit("/quiz");
    cy.get('input[type="radio"]').first().focus().should("be.focused");
    cy.get('input[type="radio"]').should("not.have.attr", "tabindex", "-1");
  });

  it("s'affiche correctement en viewport mobile (375px)", () => {
    cy.viewport(375, 667);
    cy.visit("/");
    cy.contains("Démarrer le diagnostic").should("be.visible");
    cy.get("body").then(($body) => {
      expect($body[0].scrollWidth).to.be.at.most(375);
    });
  });

  it("Q9 rend des checkboxes vertes (cases .checkbox-option)", () => {
    cy.visit("/quiz");
    // Avancer jusqu'à Q9
    cy.contains("label", "Management/Encadrement").click();
    cy.contains("button", "Suivant").click();
    cy.contains("label", "BTS / BTSA").click();
    cy.contains("button", "Suivant").click();
    cy.contains("label", "Urbain").click();
    cy.contains("button", "Suivant").click();
    cy.contains("label", "Produire / cultiver").click();
    cy.contains("button", "Suivant").click();
    cy.contains("label", "Non").click();
    cy.contains("button", "Suivant").click();
    cy.contains("label", "6-12 mois").click();
    cy.contains("button", "Suivant").click();
    cy.contains("label", "5-15k").click();
    cy.contains("button", "Suivant").click();
    cy.contains("label", "Oui").click();
    cy.contains("button", "Suivant").click();

    // Q9 — doit afficher des .checkbox-option (pas des .bloc-option)
    cy.get(".checkbox-option").should("have.length.at.least", 2);
    cy.get(".options-checkboxes").should("exist");

    // Sélectionner une peur — la case doit être cochée en vert
    cy.contains("label", "Chômage").click();
    cy.contains("label", "Chômage").find('input[type="checkbox"]').should("be.checked");
  });

  it("affiche le bloc peurs dans les résultats quand Q9 est rempli", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.get(".peurs-block").should("be.visible");
    cy.get(".peurs-list li").should("have.length.at.least", 1);
  });

  it("le modal email se ferme en cliquant sur l'overlay", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.contains("Recevoir mon diagnostic par email").click();
    cy.get(".email-modal").should("be.visible");
    cy.get(".email-modal-overlay").click({ force: true });
    cy.get(".email-modal").should("not.exist");
  });
});
