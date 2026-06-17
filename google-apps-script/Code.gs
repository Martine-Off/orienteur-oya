/**
 * Backend POC L'Orienteur OYA — Google Apps Script
 *
 * Reçoit le POST JSON envoyé par React (src/utils/api.js), insère une ligne
 * dans l'onglet "Réponses" du Google Sheet, puis envoie un email Brevo
 * au candidat avec son diagnostic.
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
    const emailResult = sendEmailBrevo(data.email, data.top_3_métiers, data.scores);

    const status = emailResult.ok ? "OK" : ("EMAIL_ERROR:" + emailResult.error);
    return ContentService.createTextOutput(status).setMimeType(ContentService.MimeType.TEXT);
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
    data.Q9_region,
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

function sendEmailBrevo(email, métiers, scores) {
  const brevoKey = PropertiesService.getScriptProperties().getProperty("BREVO_API_KEY");
  if (!brevoKey) {
    const msg = "BREVO_API_KEY manquante dans Project Settings > Script properties";
    Logger.log(msg);
    return { ok: false, error: msg };
  }

  const brevoUrl = "https://api.brevo.com/v3/smtp/email";

  const payload = {
    to: [{ email: email }],
    sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
    subject: "Votre diagnostic L'Orienteur OYA",
    htmlContent:
      "<h2>Votre diagnostic d'orientation</h2>" +
      "<p>Voici les 3 métiers correspondant à votre profil :</p>" +
      "<ol>" +
      "<li><strong>" + métiers[0] + "</strong> — Score : " + scores[0] + "/100</li>" +
      "<li><strong>" + métiers[1] + "</strong> — Score : " + scores[1] + "/100</li>" +
      "<li><strong>" + métiers[2] + "</strong> — Score : " + scores[2] + "/100</li>" +
      "</ol>" +
      "<p>Découvrez les formations correspondantes sur <a href=\"https://oya.fr\">oya.fr</a></p>" +
      "<p>À bientôt !</p>" +
      "<p><small>Vous recevez cet email car vous avez accepté de recevoir votre diagnostic et " +
      "que vos réponses soient utilisées à titre statistique (RGPD).</small></p>",
  };

  const options = {
    method: "post",
    headers: {
      "api-key": brevoKey,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(brevoUrl, options);
  const code = response.getResponseCode();
  if (code !== 201) {
    const detail = code + " - " + response.getContentText();
    Logger.log("Brevo error: " + detail);
    return { ok: false, error: detail };
  }
  return { ok: true };
}
