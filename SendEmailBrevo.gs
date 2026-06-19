/**
 * SendEmailBrevo.gs — À coller dans le projet Google Apps Script OYA
 * ====================================================================
 * 1. Ouvrir le Apps Script (extensions → Apps Script depuis la Sheet)
 * 2. Créer un nouveau fichier : "SendEmailBrevo" (Fichier → Nouveau → Script)
 * 3. Coller tout ce fichier
 * 4. Dans doPost() (fichier principal Code.gs), remplacer l'appel email par :
 *      sendEmailBrevo(data);
 * 5. Ajouter la clé Brevo dans Propriétés du script :
 *    Project Settings → Script Properties → BREVO_API_KEY = xkeysib-...
 */

// ─── Couleurs (doivent matcher index.css OYA) ────────────────────────────────
var RANK_COLORS   = ['#EF8D11', '#38AA3F', '#9B7B6B'];
var RANK_LABELS   = ['⭐ Meilleure correspondance', 'Bonne correspondance', 'À explorer'];
var COLOR_TITLE   = '#2E7D33';
var COLOR_CTA     = '#A85D08';
var COLOR_GREEN   = '#38AA3F';
var COLOR_ORANGE  = '#EF8D11';
var COLOR_TEXT    = '#424242';
var COLOR_MUTED   = '#888888';
var COLOR_TRACK   = '#F0EFEC';
var COLOR_BORDER  = '#E8E8E8';
var COLOR_SALMON  = '#FFFBF8';

// ─── Construire le HTML d'une carte thématique ───────────────────────────────
function buildCard_(rank, thematique, score, metiersRows, competences, statut, niveau) {
  var borderColor = rank === 1 ? COLOR_ORANGE : COLOR_BORDER;
  var badgeColor  = RANK_COLORS[rank - 1];
  var barColor    = RANK_COLORS[rank - 1];

  var metiersHtml = metiersRows.map(function(row) {
    return '<tr>' +
      '<td style="padding:10px 18px;border-bottom:1px solid ' + COLOR_BORDER + ';font-size:13px;color:' + COLOR_TEXT + ';">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
          '<td style="color:' + COLOR_TEXT + ';">' + row.nom + '</td>' +
          '<td align="right">' +
            '<span style="font-size:11px;font-weight:700;background:' + COLOR_GREEN + ';color:#fff;padding:3px 8px;border-radius:999px;">' + row.score + '/100</span>' +
          '</td>' +
        '</tr></table>' +
      '</td>' +
    '</tr>';
  }).join('');

  var detailsHtml = '';
  if (competences) {
    detailsHtml =
      '<tr><td style="padding:12px 18px 14px;background:#F4F3F0;border-top:1px solid ' + COLOR_BORDER + ';">' +
        '<p style="margin:0 0 4px;font-size:11px;font-weight:700;color:' + COLOR_MUTED + ';text-transform:uppercase;letter-spacing:0.06em;">Compétences clés</p>' +
        '<p style="margin:0;font-size:12px;color:' + COLOR_TEXT + ';line-height:1.6;">' + competences + '</p>' +
        (statut ? '<p style="margin:6px 0 0;font-size:11px;color:' + COLOR_MUTED + ';">Statut marché : <strong style="color:' + COLOR_TEXT + ';">' + statut + '</strong></p>' : '') +
        (niveau ? '<p style="margin:4px 0 0;font-size:11px;color:' + COLOR_MUTED + ';">Niveau requis : <strong style="color:' + COLOR_TEXT + ';">' + niveau + '</strong></p>' : '') +
      '</td></tr>';
  }

  return (
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" ' +
      'style="border:2px solid ' + borderColor + ';border-radius:12px;overflow:hidden;background:#fff;margin-bottom:14px;">' +
      // Header
      '<tr><td style="padding:16px 18px 14px;border-bottom:1px solid ' + COLOR_BORDER + ';">' +
        '<p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:' + badgeColor + ';">' + RANK_LABELS[rank-1] + '</p>' +
        '<h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:' + COLOR_TITLE + ';">' + thematique + '</h2>' +
        // Barre de score
        '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
          '<td style="padding-right:10px;">' +
            '<table width="100%" cellpadding="0" cellspacing="0" border="0" ' +
              'style="background:' + COLOR_TRACK + ';border-radius:4px;height:8px;overflow:hidden;">' +
              '<tr>' +
                '<td width="' + score + '%" bgcolor="' + barColor + '" style="height:8px;font-size:1px;line-height:1px;border-radius:4px;">&nbsp;</td>' +
                '<td></td>' +
              '</tr>' +
            '</table>' +
          '</td>' +
          '<td width="40" style="font-size:13px;font-weight:700;color:' + COLOR_TEXT + ';text-align:right;white-space:nowrap;">' + score + '%</td>' +
        '</tr></table>' +
      '</td></tr>' +
      // Métiers
      '<tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0">' +
        metiersHtml +
      '</table></td></tr>' +
      // Détails optionnels
      detailsHtml +
    '</table>'
  );
}

// ─── Construire le HTML complet du diagnostic ────────────────────────────────
function buildDiagnosticEmailHtml(data) {
  var thematiques = [data.thematique_1, data.thematique_2, data.thematique_3];
  var scores      = [data.score_1, data.score_2, data.score_3];
  var topMetiers  = [data.metier_1, data.metier_2, data.metier_3];
  var topScores   = [data.score_1, data.score_2, data.score_3];
  var peurs       = data.Q9_peurs || '';
  var region      = data.région || data.Q10_region || '';

  // Construire les rangées métiers par carte (1 seul métier dispo depuis le payload de base)
  // Pour enrichir avec métiers_2/3, ajouter data.metiers_2, data.metiers_3 dans doPost
  var cards = '';
  for (var i = 0; i < 3; i++) {
    if (!thematiques[i]) continue;
    var rows = [];
    if (topMetiers[i]) rows.push({ nom: topMetiers[i], score: topScores[i] || '—' });
    if (data.metiers_2 && data.metiers_2[i]) rows.push({ nom: data.metiers_2[i], score: (data.scores_2 || [])[i] || '—' });
    if (data.metiers_3 && data.metiers_3[i]) rows.push({ nom: data.metiers_3[i], score: (data.scores_3 || [])[i] || '—' });

    var competences = data.competences ? (Array.isArray(data.competences[i]) ? data.competences[i].join(' · ') : data.competences[i]) : '';
    var statut      = data.statuts  ? data.statuts[i]  : '';
    var niveau      = data.niveaux  ? data.niveaux[i]  : '';

    cards += buildCard_(i + 1, thematiques[i], scores[i] || 0, rows, competences, statut, niveau);
  }

  // Bloc peurs Q9
  var peursHtml = '';
  if (peurs) {
    var badges = peurs.split(',').map(function(p) {
      return '<span style="display:inline-block;background:rgba(56,170,63,0.12);color:' + COLOR_TITLE + ';' +
             'font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;margin:2px 4px 2px 0;">' +
             p.trim() + '</span>';
    }).join('');
    peursHtml =
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" ' +
        'style="background:' + COLOR_SALMON + ';border:1px solid rgba(239,141,17,0.25);border-radius:12px;margin-bottom:20px;">' +
        '<tr><td style="padding:16px 20px;">' +
          '<p style="margin:0 0 10px;font-size:13px;font-weight:700;color:' + COLOR_TITLE + ';">Vos préoccupations identifiées</p>' +
          '<p style="margin:0;line-height:1.8;">' + badges + '</p>' +
        '</td></tr>' +
      '</table>';
  }

  return '<!DOCTYPE html><html lang="fr"><head>' +
    '<meta charset="UTF-8"/>' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
    '</head>' +
    '<body style="margin:0;padding:0;background-color:#F4F3F0;font-family:Arial,Helvetica,sans-serif;color:' + COLOR_TEXT + ';">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F3F0;padding:32px 0;">' +
    '<tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" border="0" ' +
      'style="max-width:600px;width:100%;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">' +

      // En-tête
      '<tr><td style="padding:28px 28px 20px;border-bottom:3px solid ' + COLOR_ORANGE + ';background:#fff;">' +
        '<p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:' + COLOR_ORANGE + ';">OYA — Institut de la transition alimentaire</p>' +
        '<h1 style="margin:0;font-size:22px;font-weight:700;color:' + COLOR_TITLE + ';line-height:1.3;">Votre diagnostic personnalisé</h1>' +
        (region ? '<p style="margin:8px 0 0;font-size:13px;color:' + COLOR_MUTED + ';">Région : <strong style="color:' + COLOR_TEXT + ';">' + region + '</strong></p>' : '') +
      '</td></tr>' +

      // Intro
      '<tr><td style="padding:20px 28px 12px;">' +
        '<p style="margin:0;font-size:14px;color:' + COLOR_TEXT + ';line-height:1.6;">' +
          'Voici vos <strong>3 thématiques de reconversion</strong> les mieux adaptées à votre profil.' +
        '</p>' +
      '</td></tr>' +

      // Cartes
      '<tr><td style="padding:0 28px;">' + cards + '</td></tr>' +

      // Peurs
      (peursHtml ? '<tr><td style="padding:0 28px 4px;">' + peursHtml + '</td></tr>' : '') +

      // CTA
      '<tr><td style="padding:20px 28px;" align="center">' +
        '<a href="https://www.lescolsverts.fr/" target="_blank" ' +
           'style="display:inline-block;background:' + COLOR_CTA + ';color:#fff;font-size:14px;font-weight:700;' +
           'text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.02em;">' +
          'Découvrez le réseau des Cols Verts' +
        '</a>' +
      '</td></tr>' +

      // Footer
      '<tr><td style="padding:16px 28px 24px;border-top:1px solid ' + COLOR_BORDER + ';text-align:center;">' +
        '<p style="margin:0 0 4px;font-size:11px;color:' + COLOR_MUTED + ';">OYA — Institut de la transition alimentaire</p>' +
        '<p style="margin:0;font-size:11px;color:#BBBBBB;">Vous recevez cet email car vous avez accepté que vos réponses soient utilisées à titre diagnostique (RGPD).</p>' +
      '</td></tr>' +

    '</table>' +
    '</td></tr></table>' +
    '</body></html>';
}

// ─── Envoi via Brevo ─────────────────────────────────────────────────────────
function sendEmailBrevo(data) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('BREVO_API_KEY');
  if (!apiKey) {
    console.error('BREVO_API_KEY manquante dans les propriétés du script');
    return;
  }

  var subject = 'Votre diagnostic OYA'
    + (data.thematique_1 ? ' — ' + data.thematique_1 : '');

  var htmlContent = buildDiagnosticEmailHtml(data);

  var payload = {
    sender:      { name: 'OYA L\'Orienteur', email: 'noreply@oya.fr' },
    to:          [{ email: data.email }],
    subject:     subject,
    htmlContent: htmlContent
  };

  var options = {
    method:          'post',
    contentType:     'application/json',
    headers:         { 'api-key': apiKey },
    payload:         JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch('https://api.brevo.com/v3/smtp/email', options);
  var code     = response.getResponseCode();
  var result   = JSON.parse(response.getContentText());

  if (code !== 201) {
    console.error('Brevo error ' + code + ':', JSON.stringify(result));
  } else {
    console.log('Email envoyé à', data.email, '— messageId:', result.messageId);
  }
}
