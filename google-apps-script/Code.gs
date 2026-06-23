// Code.gs — Projet Google Apps Script OYA
// ══════════════════════════════════════════════════
// 1. Ouvrir Apps Script depuis la Sheet : Extensions → Apps Script
// 2. Ce fichier est le point d'entrée principal (doPost)
// 3. SendEmailBrevo.gs doit aussi être présent dans le même projet Apps Script
// 4. Déployer : Déployer → Nouvelle déploiement → Application Web
//      - Exécuter en tant que : Moi
//      - Accès : Tout le monde

const SHEET_NAME_REPONSES = "Réponses";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.email || !EMAIL_REGEX.test(String(data.email).trim())) {
      return ContentService.createTextOutput("Invalid email")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    if (!data.rgpd_accepte) {
      return ContentService.createTextOutput("RGPD consent required")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    appendReponse(data);

    // ── Envoi email — erreurs remontées au client ──
    try {
      sendEmailBrevo(data);
      console.log("✅ Email envoyé à " + data.email);
    } catch (emailErr) {
      console.error("❌ Erreur email pour " + data.email + " : " + emailErr.toString());
      return ContentService.createTextOutput("EMAIL_ERROR:" + emailErr.toString())
        .setMimeType(ContentService.MimeType.TEXT);
    }

    return ContentService.createTextOutput("OK")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    console.error("❌ Erreur doPost : " + error.toString());
    return ContentService.createTextOutput("Error")
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function appendReponse(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME_REPONSES);

  const th1 = data.top_3_thematiques?.[0] ?? data.thematique_1 ?? "";
  const th2 = data.top_3_thematiques?.[1] ?? data.thematique_2 ?? "";
  const th3 = data.top_3_thematiques?.[2] ?? data.thematique_3 ?? "";
  const m1  = data.top_3_metiers?.[0]     ?? data.metier_1     ?? "";
  const m2  = data.top_3_metiers?.[1]     ?? data.metier_2     ?? "";
  const m3  = data.top_3_metiers?.[2]     ?? data.metier_3     ?? "";
  const s1  = data.scores_thematiques?.[0] ?? data.score_1     ?? "";
  const s2  = data.scores_thematiques?.[1] ?? data.score_2     ?? "";
  const s3  = data.scores_thematiques?.[2] ?? data.score_3     ?? "";
  const tenu = data.etre_tenu_au_courant === true;

  sheet.appendRow([
    new Date(),
    data.email,
    data.Q1  || "",
    data.Q2  || "",
    data.Q3  || "",
    data.Q4  || "",
    data.Q5  || "",
    data.Q6  || "",
    data.Q7  || "",
    data.Q8  || "",
    data.Q9_peurs   || "",
    data.Q10_region || "",
    th1, m1, s1,
    th2, m2, s2,
    th3, m3, s3,
    tenu,
  ]);
}
