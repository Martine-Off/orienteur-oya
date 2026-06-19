/**
 * Backend L'Orienteur OYA — Google Apps Script
 *
 * Reçoit le POST JSON envoyé par React (src/utils/api.js), insère une ligne
 * dans l'onglet "Réponses" du Google Sheet, puis envoie un email Brevo
 * au candidat avec son diagnostic HTML.
 *
 * IMPORTANT — CORS : React envoie ce POST en mode "no-cors" avec
 * Content-Type "text/plain" car Apps Script ne gère pas le préflight CORS.
 * Le corps reste un JSON classique, parsé ici via JSON.parse().
 *
 * Installation : voir README-TECHNIQUE.md, section "Déployer le backend".
 */

const SHEET_NAME_REPONSES = "Réponses";
const BREVO_SENDER_EMAIL = "martine.desmaroux@gmail.com";
const BREVO_SENDER_NAME = "OYA L'Orienteur";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.email || !data.top_3_métiers || !data.scores) {
      return ContentService.createTextOutput("Invalid data").setMimeType(
        ContentService.MimeType.TEXT,
      );
    }

    appendReponse(data);
    sendEmailBrevo(data);

    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput("Error").setMimeType(ContentService.MimeType.TEXT);
  }
}

function appendReponse(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_REPONSES);
  sheet.appendRow([
    new Date(),
    data.email,
    data.Q1,
    data.Q2,
    data.Q3,
    data.Q4,
    data.Q5,
    data.Q6,
    data.Q7,
    data.Q8,
    data.Q9_peurs || "",
    data.Q10_region || "",
    data.top_3_métiers[0] || "",
    data.top_3_métiers[1] || "",
    data.top_3_métiers[2] || "",
    data.scores[0] || "",
    data.scores[1] || "",
    data.scores[2] || "",
    data.région,
    data.bloc,
    data.être_tenu_au_courant === true,
  ]);
}
