/**
 * Tests E2E scoring — vérifie que les métiers sont chargés, les scores calculés
 * et que les résultats sont cohérents (ordonnés, dans 0-100, 3 thématiques).
 *
 * Pré-requis : npm run dev en cours (http://localhost:5173)
 * La clé API Sheet peut être absente → le fallback /metiers.json est utilisé.
 */

function repondreAuQuiz() {
  cy.contains("Démarrer le quiz").click();
  cy.contains("label", "Management/Encadrement").click();
  cy.contains("button", "Suivant").click();
  cy.get("#Q2").select("BTS / BTSA");
  cy.contains("button", "Suivant").click();
  cy.contains("label", "Flexible").click();
  cy.contains("button", "Suivant").click();
  cy.contains("label", "Piloter / organiser").click();
  cy.contains("button", "Suivant").click();
  cy.contains("label", "Non").click();
  cy.contains("button", "Suivant").click();
  cy.get("#Q6").select("6-12 mois");
  cy.contains("button", "Suivant").click();
  cy.get("#Q7").select("5-15k");
  cy.contains("button", "Suivant").click();
  cy.contains("label", "Oui").click();
  cy.contains("button", "Suivant").click();
  cy.contains("label", "Chômage").click();
  cy.contains("button", "Suivant").click();
  cy.get("#Q10").select("Île-de-France");
  cy.contains("button", "Voir mes résultats").click();
}

describe("Scoring avec métiers (Sheet ou fallback JSON)", () => {
  it("affiche 3 thématiques après avoir complété le quiz", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.contains("Vos thématiques de reconversion").should("be.visible");
    cy.get(".thematic-card").should("have.length", 3);
  });

  it("les scores sont des entiers entre 0 et 100", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.get(".thematic-card").each($card => {
      // Le score est affiché sous forme "75%" ou "75"
      const text = $card.text();
      const match = text.match(/(\d+)\s*%?/);
      if (match) {
        const score = parseInt(match[1], 10);
        expect(score).to.be.gte(0);
        expect(score).to.be.lte(100);
      }
    });
  });

  it("la première thématique a un score >= aux suivantes", () => {
    cy.visit("/");
    repondreAuQuiz();
    const scores = [];
    cy.get(".thematic-card").each($card => {
      const match = $card.text().match(/(\d+)\s*%?/);
      if (match) scores.push(parseInt(match[1], 10));
    }).then(() => {
      if (scores.length >= 2) expect(scores[0]).to.be.gte(scores[1]);
      if (scores.length >= 3) expect(scores[1]).to.be.gte(scores[2]);
    });
  });

  it("les métiers sont mis en cache dans localStorage après chargement", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.window().then(win => {
      const raw = win.localStorage.getItem("oya_metiers");
      expect(raw).to.not.be.null;
      const parsed = JSON.parse(raw);
      expect(parsed).to.be.an("array").with.length.greaterThan(0);
      // Vérifie la structure du premier métier
      expect(parsed[0]).to.have.property("metier").that.is.a("string");
      expect(parsed[0]).to.have.property("poids").that.is.an("object");
      expect(parsed[0]).to.have.property("bloc").that.is.a("string");
    });
  });

  it("le cache expire : un timestamp est enregistré avec les métiers", () => {
    cy.visit("/");
    repondreAuQuiz();
    cy.window().then(win => {
      const ts = win.localStorage.getItem("oya_metiers_timestamp");
      expect(ts).to.not.be.null;
      const age = (Date.now() - parseInt(ts, 10)) / 1000;
      expect(age).to.be.lessThan(30); // moins de 30s (chargé à l'instant)
    });
  });
});
