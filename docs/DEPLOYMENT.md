# Déployer en production — Guide Martine

## Prérequis

- Compte Netlify connecté au repo GitHub `Martine-Off/orienteur-oya`
- URL Apps Script disponible (fournie par Boris ou générée via `google-apps-script/Code.gs`)

---

## Étapes

### 1. Configurer la variable d'environnement

**app.netlify.com** → ton site → **Site configuration** → **Environment variables**

Cliquer **Add a variable** :

| Clé | Valeur |
|---|---|
| `VITE_LEADS_ENDPOINT` | `https://script.google.com/macros/s/XXXXX/exec` |

Remplacer `XXXXX` par l'ID réel du déploiement Apps Script.

> ⚠️ Sans cette variable, le quiz fonctionne mais aucun email n'est envoyé et rien n'est écrit dans le Sheet.

---

### 2. Déclencher le déploiement

**Deploys** → **Trigger deploy** → **Deploy site**

Attendre **2-3 minutes** (barre de progression en haut de page).

> Pourquoi redéployer manuellement ? Vite intègre les variables d'environnement au moment du build (pas au runtime). Changer la variable dans Netlify sans redéployer n'a aucun effet.

---

### 3. Tester en production

Ouvrir https://orienteur-oya.netlify.app dans un onglet privé.

**Checklist test complet :**

- [ ] La page d'accueil s'affiche (logo OYA, bouton "Démarrer le quiz")
- [ ] Le quiz avance question par question (9 questions, barre de progression)
- [ ] Les résultats affichent 3 métiers avec scores
- [ ] Cliquer "Recevoir mon diagnostic par email"
- [ ] Saisir ton email, cocher le RGPD, cliquer "Envoyer"
- [ ] Page de confirmation avec checkmark animé et email rappelé
- [ ] Email reçu dans la boîte (vérifier spam si absent après 5 min)
- [ ] Nouvelle ligne visible dans le Google Sheet → onglet "Réponses"

---

## En cas de problème

| Symptôme | Cause probable | Solution |
|---|---|---|
| Email non reçu | `BREVO_API_KEY` manquante ou sender non vérifié | Voir `README.md` section 11 — Troubleshooting Brevo |
| Rien dans le Sheet | Apps Script non déployé ou mauvaise URL | Vérifier `VITE_LEADS_ENDPOINT` + redéployer |
| 404 sur `/quiz` | Règle `_redirects` absente | Vérifier que `public/_redirects` est bien dans le repo |
| Build échoue | Variable mal saisie | Vérifier l'orthographe exacte : `VITE_LEADS_ENDPOINT` |

Pour toute question → Claudie (tech) ou consulter `README.md`.
