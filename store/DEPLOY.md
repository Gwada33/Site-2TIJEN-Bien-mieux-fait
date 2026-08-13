# Déploiement 2TIJEN — Railway (backend) + Vercel (storefront)

> Guide pas-à-pas pour mettre en ligne le site avec un nom de domaine.
> Stack : backend Medusa v2 (`store/apps/backend`) + storefront Next.js 15
> (`store/apps/storefront`) dans un monorepo npm (`store/`).
>
> 💡 **Alternative home server (gratuit)** : voir `README-HOMESERVER.md`
> (Podman + Cloudflare Tunnel — Dockerfiles déjà prêts dans `store/apps/*`).

---

## 0. Prérequis

- [ ] Un compte [Railway](https://railway.app) (GitHub login) et [Vercel](https://vercel.com)
- [ ] Le nom de domaine (ex. `2tijen.com`) chez ton registrar (OVH, Namecheap…)
- [x] ~~Le code poussé sur GitHub~~ → **déjà fait** :
      le repo est initialisé sur `main` et poussé sur
      [`github.com/Gwada33/Site-2TIJEN-Bien-mieux-fait`](https://github.com/Gwada33/Site-2TIJEN-Bien-mieux-fait).
      Après un changement local : `git add . && git commit -m "..." && git push`

> ⚠️ `.gitignore` exclut déjà `node_modules` et tous les `.env*`.
> Le fichier `store/apps/backend/.env` (DB locale) ne partira **jamais** en ligne.

---

## 1. Backend → Railway

### 1.1 Créer le projet et les services

1. Railway → **New Project** → **Deploy from GitHub repo** → choisis le repo
   `Gwada33/Site-2TIJEN-Bien-mieux-fait`.
2. Railway détecte le monorepo : sélectionne **root directory = `store`**.
   (La config `store/railway.json` pointe déjà vers `apps/backend/Dockerfile`
   et active un healthcheck sur `/health` : Railway n'éteint pas le deploy
   pendant les migrations.)
3. Ajoute les plugins dans le projet :
   - **PostgreSQL** (Database → Create) → note l'URL `DATABASE_URL`
   - **Redis** (recommandé) → note l'URL `REDIS_URL`

### 1.2 Variables d'environnement (service backend)

Copie depuis `store/apps/backend/.env.production.example` (tout via l'UI Railway) :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | URL du plugin PostgreSQL |
| `REDIS_URL` | URL du plugin Redis (optionnel) |
| `JWT_SECRET` / `COOKIE_SECRET` | `openssl rand -base64 32` × 2 |
| `STORE_CORS` | `https://2tijen.com,https://www.2tijen.com` |
| `AUTH_CORS` | idem `STORE_CORS` |
| `ADMIN_CORS` | `https://api.2tijen.com` |
| `S3_BUCKET`, `S3_PUBLIC_URL`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Cloudflare R2 (voir §4) — **recommandé**, sinon disque éphémère |

### 1.3 Déployer

1. **Deploy** → le Dockerfile build tout (npm ci + build Medusa + admin) puis lance
   `medusa db:migrate && medusa start` (migrations automatiques au démarrage).
2. Créer le **compte admin** (une seule fois, sur la DB de prod) :
   - via le CLI Railway : `railway run npx medusa user -e admin@2tijen.com -p UN-MOT-DE-PASSE`
   - ou via **Railway → service → command** (shell) : `npx medusa user -e ... -p ...`
3. Vérifier : `https://api.2tijen.com/health` → `{"status":"ok"}`.

### 1.4 Domaine API

Railway → service → **Settings → Networking → Generate Domain** (ou Custom Domain) :
`api.2tijen.com` → Railway fournit un CNAME cible.
L'admin sera sur `https://api.2tijen.com/app`.

---

## 2. Storefront → Vercel

1. Vercel → **Add New → Project** → importe le même repo.
2. **Root Directory = `store/apps/storefront`** (Next.js auto-détecté).
3. Variables d'environnement (Production) — copie depuis
   `store/apps/storefront/.env.production.example` :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `https://api.2tijen.com` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | ta clé `pk_…` (Admin → Settings → API keys) |
| `NEXT_PUBLIC_DEFAULT_REGION` | `gf` |
| `NEXT_PUBLIC_BASE_URL` | `https://2tijen.com` |
| `NEXT_PUBLIC_STRIPE_KEY` | vide (paiement manuel) |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | la vidéo Shopify actuelle |
| `NEXT_PUBLIC_HERO_LOGO_URL` / `NEXT_PUBLIC_NEXT_DROP_DATE` | vides pour l'instant |

> ⚠️ Le build Next.js appelle le backend (`generateStaticParams` des collections) :
> **déploie le backend d'abord**, puis le storefront.

4. **Deploy**, puis ajoute les domaines `2tijen.com` et `www.2tijen.com`
   (Vercel donne les enregistrements DNS à créer).

---

## 3. DNS (registrar)

| Enregistrement | Type | Cible |
|---|---|---|
| `@` (apex) | CNAME/ALIAS | `cname.vercel-dns.com` |
| `www` | CNAME | `cname.vercel-dns.com` |
| `api` | CNAME | (la cible Railway donnée au §1.4) |
| `cdn` (optionnel, R2) | CNAME | `pub-xxxx.r2.dev` (ou le domaine custom R2) |

---

## 4. Stockage des images (Cloudflare R2 — recommandé)

Le disque d'un conteneur Railway est **éphémère** : sans stockage externe,
les images uploadées (drops, produits) disparaissent à chaque redéploiement.

1. Créer un bucket R2 public (ou via AWS S3 / Scaleway Object Storage).
2. Créer un token API R2 (permissions : Object Read & Write).
3. Renseigner les variables `S3_*` du backend **puis redéployer**.
4. **Ré-uploader les images existantes** via l'admin (`/app`) — les anciennes
   URLs `http://localhost:9000/static/...` ne sont pas migrées automatiquement
   (dont l'image du drop : widget « Drop » → uploader à nouveau).

---

## 5. Après le déploiement — check-list

- [ ] `https://api.2tijen.com/health` répond `ok`
- [ ] `https://api.2tijen.com/app` → connexion admin OK
- [ ] `https://2tijen.com/gf` → hero avec vidéo + logo
- [ ] `https://2tijen.com/gf/store` → drop avec image + produits
- [ ] Passer une commande test (paiement manuel) jusqu'à la confirmation
- [ ] Re-uploader l'image du drop + vérifier les produits (PNG sans cadre)
- [ ] (Recommandé) Activer les **backups** du plugin Postgres Railway

---

## 6. Mises à jour

- **Backend** : `git push` → Railway redéploie automatiquement (les migrations
  tournent au démarrage).
- **Storefront** : `git push` → Vercel rebuild. Pour un changement de variable
  `NEXT_PUBLIC_*` : modifier dans Vercel puis **Redploy** (forcé).

---

## 7. Dépannage rapide

| Symptôme | Cause probable |
|---|---|
| Storefront 404 / build qui échoue | Backend pas encore déployé → déployer d'abord, ou `NEXT_PUBLIC_MEDUSA_BACKEND_URL` erroné |
| CORS error dans la console | `STORE_CORS` / `AUTH_CORS` ne contiennent pas le domaine EXACT (avec `https://` et sans `/`) |
| Images qui disparaissent après redéploiement | Stockage local → passer sur R2 (§4) |
| Login admin refusé | Compte non créé sur la DB prod (§1.3) |
| `medusa db:migrate` qui échoue au boot | `DATABASE_URL` incorrect ou DB pas encore prête (redéployer après) |
