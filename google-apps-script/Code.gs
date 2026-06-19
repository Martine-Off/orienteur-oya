/**
 * Backend POC L'Orienteur OYA -- Google Apps Script
 *
 * Recoit le POST JSON envoye par React (src/utils/api.js), insere une ligne
 * dans l'onglet "Reponses" du Google Sheet, puis envoie un email Brevo
 * au candidat avec son diagnostic.
 *
 * IMPORTANT -- CORS : React envoie ce POST en mode "no-cors" avec
 * Content-Type "text/plain" car Apps Script ne gere pas le preflight CORS.
 * Le corps reste un JSON classique, parse ici via JSON.parse().
 *
 * Installation : voir README-TECHNIQUE.md, section "Deployer le backend".
 */

const SHEET_NAME_REPONSES = "Reponses";
const BREVO_SENDER_EMAIL = "martine.desmaroux3@gmail.com";
const BREVO_SENDER_NAME = "OYA L'Orienteur";

function doPost(e) {
  try {
    // React envoie en no-cors / text-plain -- le corps est quand meme du JSON valide.
    const data = JSON.parse(e.postData.contents);

    if (!data.email) {
      return ContentService.createTextOutput("Invalid data").setMimeType(
        ContentService.MimeType.TEXT
      );
    }

    appendReponse(data);
    const emailResult = sendEmailBrevo(data.email, data);

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
    data.Q9_peurs || "",          // col K -- peurs et preoccupations (CSV des cles cochees)
    data.Q10_region || "",        // col L -- region
    data.thematique_1 || "",
    data.metier_1 || "",
    data.score_1 || "",
    data.thematique_2 || "",
    data.metier_2 || "",
    data.score_2 || "",
    data.thematique_3 || "",
    data.metier_3 || "",
    data.score_3 || "",
    data.etre_tenu_au_courant === true,
  ]);
}

function sendEmailBrevo(email, data) {
  // Cle stockee dans Script Properties, jamais en dur dans le code.
  // Apps Script editor -> Project Settings -> Script properties -> BREVO_API_KEY.
  const brevoKey = PropertiesService.getScriptProperties().getProperty("BREVO_API_KEY");
  if (!brevoKey) {
    const msg = "BREVO_API_KEY manquante dans Project Settings > Script properties";
    Logger.log(msg);
    return { ok: false, error: msg };
  }

  const thematiques = [data.thematique_1, data.thematique_2, data.thematique_3];
  const scoresThematiques = [data.score_1, data.score_2, data.score_3];
  const metiers = [data.metier_1, data.metier_2, data.metier_3];
  const scores = [data.score_1, data.score_2, data.score_3];

  var htmlDiagnostic = "";
  if (thematiques.length > 0) {
    htmlDiagnostic =
      "<h3 style='color:#38AA3F;margin-bottom:12px;'>Vos 3 thematiques prioritaires</h3>" +
      thematiques.map(function(t, i) {
        var score = scoresThematiques[i] ? scoresThematiques[i] + "/100" : "";
        var metier = metiers[i]
          ? "<br><small style='color:#888;'>Ex : " + metiers[i] + "</small>"
          : "";
        var style = i === 0
          ? "padding:12px 16px;margin-bottom:10px;border-left:4px solid #EF8D11;background:#FFFBF8;border-radius:4px;"
          : "padding:12px 16px;margin-bottom:10px;border-left:4px solid #E8E8E8;border-radius:4px;";
        var badge = i === 0
          ? "<div style='font-size:0.72em;font-weight:700;text-transform:uppercase;color:#EF8D11;margin-bottom:4px;'>Meilleure correspondance</div>"
          : "";
        return "<div style='" + style + "'>" +
          badge +
          "<strong>" + t + "</strong>" +
          (score
            ? " <span style='background:#38AA3F;color:#fff;border-radius:12px;padding:2px 8px;font-size:0.8em;'>" + score + "</span>"
            : "") +
          metier +
          "</div>";
      }).join("");
  } else {
    htmlDiagnostic =
      "<ol>" +
      "<li><strong>" + (metiers[0] || "") + "</strong> " + (scores[0] || "") + "/100</li>" +
      "<li><strong>" + (metiers[1] || "") + "</strong> " + (scores[1] || "") + "/100</li>" +
      "<li><strong>" + (metiers[2] || "") + "</strong> " + (scores[2] || "") + "/100</li>" +
      "</ol>";
  }

  const brevoUrl = "https://api.brevo.com/v3/smtp/email";

  const payload = {
    to: [{ email: email }],
    sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
    subject: "Votre diagnostic L'Orienteur OYA",
    htmlContent:
      "<div style='font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;'>" +
      "<h2 style='color:#38AA3F;'>Votre diagnostic d'orientation</h2>" +
      "<p>Voici vos thematiques de reconversion correspondant a votre profil :</p>" +
      htmlDiagnostic +
      "<p style='margin-top:24px;'>Decouvrez les formations correspondantes sur " +
      "<a href='https://oya.fr' style='color:#EF8D11;'>oya.fr</a></p>" +
      "<p>A bientot !</p>" +
      "<p><small style='color:#888;'>Vous recevez cet email car vous avez accepte de recevoir " +
      "votre diagnostic et que vos reponses soient utilisees a titre statistique (RGPD).</small></p>" +
      "</div>",
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
