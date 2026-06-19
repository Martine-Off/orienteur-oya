// SendEmailBrevo.gs — Projet Google Apps Script OYA
// ══════════════════════════════════════════════════
// 1. Ouvrir Apps Script depuis la Sheet : Extensions → Apps Script
// 2. Fichier → Nouveau → Script → nommer "SendEmailBrevo"
// 3. Coller ce fichier entier
// 4. Dans doPost() (Code.gs), remplacer l'appel email existant par :
//      sendEmailBrevo(data);
// 5. Ajouter la clé API : Paramètres du projet → Propriétés de script
//      BREVO_API_KEY = xkeysib-...

// ── Palette OYA (aligned with index.css) ──────────────────────────────────────
const C = {
  orange:  '#EF8D11',
  cta:     '#A85D08',
  title:   '#2E7D33',
  green:   '#38AA3F',
  text:    '#424242',
  muted:   '#767676',
  track:   '#F0EFEC',
  border:  '#E8E8E8',
  salmon:  '#FFFBF8',
};

const RANK_COLORS = [C.orange, C.green, '#9B7B6B'];
const RANK_LABELS = ['⭐ Meilleure correspondance', 'Bonne correspondance', 'À explorer'];

// ── Carte thématique HTML ─────────────────────────────────────────────────────
function buildCard(rank, thematique, score, metierRows, competences, statut, niveau) {
  const borderColor = rank === 1 ? C.orange : C.border;
  const rankColor   = RANK_COLORS[rank - 1];

  const metiersHtml = metierRows.map(({ nom, score: s }) => `
    <tr>
      <td style="padding:10px 18px;border-bottom:1px solid ${C.border};font-size:13px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="color:${C.text};">${nom}</td>
          <td align="right">
            <span style="font-size:11px;font-weight:700;background:${C.green};color:#fff;padding:3px 8px;border-radius:999px;">${s}/100</span>
          </td>
        </tr></table>
      </td>
    </tr>`).join('');

  const detailsHtml = competences ? `
    <tr><td style="padding:12px 18px 14px;background:#F4F3F0;border-top:1px solid ${C.border};">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.06em;">Compétences clés</p>
      <p style="margin:0;font-size:12px;color:${C.text};line-height:1.6;">${competences}</p>
      ${statut ? `<p style="margin:6px 0 0;font-size:11px;color:${C.muted};">Statut marché : <strong style="color:${C.text};">${statut}</strong></p>` : ''}
      ${niveau ? `<p style="margin:4px 0 0;font-size:11px;color:${C.muted};">Niveau requis : <strong style="color:${C.text};">${niveau}</strong></p>` : ''}
    </td></tr>` : '';

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:2px solid ${borderColor};border-radius:12px;overflow:hidden;background:#fff;margin-bottom:14px;">

      <!-- En-tête carte -->
      <tr><td style="padding:16px 18px 14px;border-bottom:1px solid ${C.border};">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${rankColor};">${RANK_LABELS[rank - 1]}</p>
        <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:${C.title};">${thematique}</h2>

        <!-- Barre de score -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="padding-right:10px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:${C.track};border-radius:4px;height:8px;overflow:hidden;">
              <tr>
                <td width="${score}%" bgcolor="${rankColor}" style="height:8px;font-size:1px;line-height:1px;">&nbsp;</td>
                <td></td>
              </tr>
            </table>
          </td>
          <td width="40" style="font-size:13px;font-weight:700;color:${C.text};text-align:right;white-space:nowrap;">${score}%</td>
        </tr></table>
      </td></tr>

      <!-- Métiers -->
      <tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${metiersHtml}
      </table></td></tr>

      ${detailsHtml}
    </table>`;
}

// ── Normalise les deux formats React (Results = tableaux, EmailCapture = plat) ─
function normalizeCards(data) {
  if (data.top_3_thematiques) {
    // Format Results.jsx : champs tableau
    return (data.top_3_thematiques || []).map((them, i) => ({
      thematique:  them,
      score:       data.scores_thematiques?.[i] || 0,
      metiers: [
        data.top_3_metiers?.[i] && { nom: data.top_3_metiers[i], score: data.scores?.[i]   || '—' },
        data.metiers_2?.[i]        && { nom: data.metiers_2[i],        score: data.scores_2?.[i] || '—' },
        data.metiers_3?.[i]        && { nom: data.metiers_3[i],        score: data.scores_3?.[i] || '—' },
      ].filter(Boolean),
      competences: Array.isArray(data.competences?.[i]) ? data.competences[i].join(' · ') : (data.competences?.[i] || ''),
      statut:      data.statuts?.[i]  || '',
      niveau:      data.niveaux?.[i]  || '',
    }));
  }
  // Format EmailCapture.jsx : champs plats thematique_N / metier_N / score_N
  return [
    { thematique: data.thematique_1, score: data.score_1 || 0, metiers: data.metier_1 ? [{ nom: data.metier_1, score: data.score_1 || '—' }] : [], competences: '', statut: '', niveau: '' },
    { thematique: data.thematique_2, score: data.score_2 || 0, metiers: data.metier_2 ? [{ nom: data.metier_2, score: data.score_2 || '—' }] : [], competences: '', statut: '', niveau: '' },
    { thematique: data.thematique_3, score: data.score_3 || 0, metiers: data.metier_3 ? [{ nom: data.metier_3, score: data.score_3 || '—' }] : [], competences: '', statut: '', niveau: '' },
  ].filter(c => c.thematique);
}

// ── Corps du mail complet ─────────────────────────────────────────────────────
function buildEmailHtml(data) {
  const cardData = normalizeCards(data);
  const peurs    = data.Q9_peurs || '';
  const region   = data.région || data.Q10_region || '';

  const cards = cardData.map((c, i) =>
    buildCard(i + 1, c.thematique, c.score, c.metiers, c.competences, c.statut, c.niveau)
  ).join('');

  const peursHtml = peurs ? (() => {
    const badges = peurs.split(',').map(p =>
      `<span style="display:inline-block;background:rgba(56,170,63,0.12);color:${C.title};font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;margin:2px 4px 2px 0;">${p.trim()}</span>`
    ).join('');
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:${C.salmon};border:1px solid rgba(239,141,17,0.25);border-radius:12px;margin-bottom:20px;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:${C.title};">Vos préoccupations identifiées</p>
          <p style="margin:0;line-height:1.8;">${badges}</p>
        </td></tr>
      </table>`;
  })() : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#F4F3F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${C.text};">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F3F0;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0"
  style="max-width:600px;width:100%;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

  <!-- En-tête -->
  <tr><td style="padding:28px 28px 20px;border-bottom:3px solid ${C.orange};">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${C.orange};">OYA — Institut de la transition alimentaire</p>
    <h1 style="margin:0;font-size:22px;font-weight:700;color:${C.title};line-height:1.3;">Votre diagnostic personnalisé</h1>
    ${region ? `<p style="margin:8px 0 0;font-size:13px;color:${C.muted};">Région : <strong style="color:${C.text};">${region}</strong></p>` : ''}
  </td></tr>

  <!-- Intro -->
  <tr><td style="padding:20px 28px 12px;">
    <p style="margin:0;font-size:14px;color:${C.text};line-height:1.6;">
      Voici vos <strong>3 thématiques de reconversion</strong> les mieux adaptées à votre profil.
    </p>
  </td></tr>

  <!-- Cartes résultats -->
  <tr><td style="padding:0 28px;">${cards}</td></tr>

  <!-- Préoccupations Q9 -->
  ${peursHtml ? `<tr><td style="padding:0 28px 4px;">${peursHtml}</td></tr>` : ''}

  <!-- CTA -->
  <tr><td style="padding:20px 28px;" align="center">
    <a href="https://www.lescolsverts.fr/" target="_blank"
      style="display:inline-block;background:${C.cta};color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
      Découvrir le réseau des Cols Verts
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:16px 28px 24px;border-top:1px solid ${C.border};text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:${C.muted};">OYA — Institut de la transition alimentaire</p>
    <p style="margin:0;font-size:11px;color:#BBBBBB;">Vous recevez cet email car vous avez accepté que vos réponses soient utilisées à titre diagnostique (RGPD).</p>
  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}

// ── Envoi via l'API Brevo ─────────────────────────────────────────────────────
function sendEmailBrevo(data) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('BREVO_API_KEY');
  if (!apiKey) {
    console.error('BREVO_API_KEY manquante — ajouter dans Paramètres du projet → Propriétés de script');
    return;
  }

  const firstThematique = data.top_3_thematiques?.[0] || data.thematique_1 || '';
  const subject = `Votre diagnostic OYA${firstThematique ? ` — ${firstThematique}` : ''}`;

  const response = UrlFetchApp.fetch('https://api.brevo.com/v3/smtp/email', {
    method:             'post',
    contentType:        'application/json',
    headers:            { 'api-key': apiKey },
    payload:            JSON.stringify({
      sender:      { name: "OYA L'Orienteur", email: 'm.desmaroux@eisf.fr' },
      to:          [{ email: data.email }],
      subject,
      htmlContent: buildEmailHtml(data),
    }),
    muteHttpExceptions: true,
  });

  const code   = response.getResponseCode();
  const result = JSON.parse(response.getContentText());

  if (code !== 201) {
    console.error(`Brevo erreur ${code} :`, JSON.stringify(result));
    throw new Error(`Brevo ${code}`);
  }

  console.log(`✅ Email envoyé à ${data.email} — messageId: ${result.messageId}`);
}
