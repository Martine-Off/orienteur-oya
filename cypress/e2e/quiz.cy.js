describe("Quiz d'orientation OYA", () => {
  function repondreAuQuiz() {
    cy.contains("Démarrer le quiz").click();

    cy.contains("label", "Management/Encadrement").click();
    cy.contains("button", "Suivant").click();

    cy.get("#Q2").select("BTS / BTSA");
    cy.contains("button", "Suivant").click();

    cy.contains("label", "Urbain").click();
    cy.contains("button", "Suivant").click();

    cy.contains("label", "Produire / cultiver").click();
    cy.contains("button", "Suivant").click();

    cy.contains("label", "Non").click();
    cy.contains("button", "Suivant").click();

    cy.get("#Q6").select("6-12 mois");
    cy.contains("button", "Suivant").click();

    cy.get("#Q7").select("5-15k");
    cy.contains("button", "Suivant").click();

    cy.contains("label", "Oui").click();
    cy.contains("button", "Suivant").click();

    // Q9 — peurs (checkboxes, multi-select obligatoire)
    cy.contains("label", "Chômage").click();
    cy.contains("button", "Suivant").click();

    // Q10 — région
    cy.get("#Q10").select("Île-de-France");
    cy.contains("button", "Voir mes résultats").click();
  }

  it("complète le parcours quiz -> résultats -> email -> confirmation", () => {
    cy.visit("/");
    repondreAuQuiz();

    cy.contains("Votre top 3 métiers").should("be.visible");
    cy.get(".metier-card").should("have.length", 3);

    cy.contains("Recevoir mon diagnostic par email").click();
    cy.get("#email").type("test@example.com");
    cy.get("#rgpd").check();
    cy.contains("button", "Envoyer").click();

    cy.contains("Merci !").should("be.visible");
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

  it("requiert le consentement RGPD avant l'envoi", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.contains("Recevoir mon diagnostic par email").click();
    cy.get("#email").type("test@example.com");
    cy.contains("button", "Envoyer").click();
    cy.contains("Le consentement RGPD est requis").should("be.visible");
  });

  it("rejette un email mal formé", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.contains("Recevoir mon diagnostic par email").click();
    cy.get("#email").type("pas-un-email");
    cy.get("#rgpd").check();
    cy.contains("button", "Envoyer").click();
    cy.contains("Merci de saisir une adresse email valide").should("be.visible");
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
    cy.contains("Démarrer le quiz").should("be.visible");
    cy.get("body").then(($body) => {
      expect($body[0].scrollWidth).to.be.at.most(375);
    });
  });
});
