# L'Orienteur OYA

Quiz d'orientation métier pour [OYA](https://oya.fr) — 10 questions, 3 métiers recommandés parmi 76, diagnostic envoyé par email.

**Demo live :** https://orienteur-oya.netlify.app

---

## Stack

| Couche | Techno |
|---|---|
| Frontend | React 18 + Vite, Netlify |
| Données & leads | Google Sheets + Apps Script |
| Email transactionnel | Brevo API v3 |

---

## Démarrer en local

```bash
git clone https://github.com/Martine-Off/orienteur-oya.git
cd orienteur-oya
npm install
cp .env.example .env.local   # renseigner VITE_LEADS_ENDPOINT
npm run dev                  # → http://localhost:5173
```

---

## Déployer

1. **Netlify** — connecter le repo GitHub, build command `npm run build`, publish dir `dist`, ajouter `VITE_LEADS_ENDPOINT` dans les variables d'environnement
2. **Apps Script** — coller `scripts/Code.gs` + `scripts/SendEmailBrevo.gs` dans Extensions → Apps Script, ajouter `BREVO_API_KEY` dans Project Settings → Script properties, déployer en Application Web (accès : Tout le monde)

---

## Documentation

| Doc | Contenu |
|---|---|
| [docs/AUDIT_SECU.md](docs/AUDIT_SECU.md) | Failles trouvées, fixes appliqués, action manuelle clé API |
| [docs/GUIDE_BORIS.md](docs/GUIDE_BORIS.md) | Lire les réponses, modifier les pondérations, segmenter |
| [docs/GUIDE_CANDIDAT.md](docs/GUIDE_CANDIDAT.md) | Utiliser le quiz pas-à-pas |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Déploiement détaillé (Netlify + Apps Script) |

---

## Contact

Chef de projet : Martine Desmaroux — m.desmaroux@eisf.fr  
Données métiers : Boris (OYA)
