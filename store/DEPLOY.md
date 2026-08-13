# Déploiement 2TIJEN — Coolify (single host)

> Guide pour mettre la stack en ligne **sur un seul serveur Coolify**.
> Pas de Cloudflare, pas de Vercel, pas de Railway — tout cohabite
> sur l'hôte Coolify et publié via les ports que tu choisis.
>
> Stack : Postgres + Redis + Medusa backend + Next.js storefront,
> le tout dans des services Coolify séparés.

---

## 0. Prérequis

- Une instance Coolify opérationnelle (v4).
- Le repo GitHub poussé : `Gwada33/Site-2TIJEN-Bien-mieux-fait`.
  (Après un changement local : `git add . && git commit -m "..." && git push`)
- ⚠️ `.gitignore` exclut déjà `node_modules` et tous les `.env*`.
- Tu n'as **pas** encore de nom de domaine → on reste en HTTP local,
  Coolify publie sur les ports de l'hôte. Quand tu auras un domaine,
  reporte-toi à la section §6 pour brancher HTTPS.

> Ports utilisés sur l'hôte Coolify :
> - **Coolify UI** : `8000`
> - **Storefront** : `8001` ← n'est PAS en conflit avec l'UI
> - **Backend API / admin** : `9000`

---

## 1. Créer le projet Coolify

1. **Coolify → Projects → Add Project** → nomme-le `2tijen`.
2. Dans ce projet, tu vas créer **4 services** dans l'ordre suivant :
   - (a) Postgres
   - (b) Redis
   - (c) Backend
   - (d) Storefront

> Coolify les fera communiquer via leur réseau privé (`<service-name>`).

---

## 2. Service (a) — Postgres

**Coolify → Service → Add → Database → PostgreSQL**

| Champ | Valeur |
|---|---|
| Image | `postgres:16-alpine` |
| DB name | `medusa-store` |
| Username | `medusa` |
| Password | *(auto-généré par Coolify, COPIE-LE)* |
| Volume | `pg-data` monté sur `/var/lib/postgresql/data` |
| Port | laisser par défaut (`5432` interne, **pas exposé à l'hôte**) |

Note l'URL complète que Coolify affiche (forme `postgres://medusa:XXX@postgres:5432/medusa-store`).

---

## 3. Service (b) — Redis

**Coolify → Service → Add → Database → Redis**

| Champ | Valeur |
|---|---|
| Image | `redis:7-alpine` |
| Command | `redis-server --appendonly yes` |
| Volume | `redis-data` monté sur `/data` |
| Port | **pas exposé à l'hôte** (interne uniquement) |

Coolify devrait te donner une URL type `redis://redis:6379`.

---

## 4. Service (c) — Backend Medusa

**Coolify → Service → Add → Application**

### 4.1 Build

| Champ | Valeur |
|---|---|
| Source | GitHub → ton repo |
| Branch | `main` |
| **Build Pack** | **Dockerfile** |
| **Dockerfile path** | `store/apps/backend/Dockerfile` |
| **Base directory / Build context** | `store` |

### 4.2 Port

| Champ | Valeur |
|---|---|
| Container port | `9000` |
| **Host port** | `9000` (exposé sur l'hôte — c'est lui qui sert l'API/l'admin) |

### 4.3 Variables d'environnement

Ajoute-les dans la section "Environment Variables" :

```
NODE_ENV=production
PORT=9000
DATABASE_URL=<colle ici l'URL Postgres du §2>
REDIS_URL=redis://redis:6379
JWT_SECRET=<openssl rand -base64 32>
COOKIE_SECRET=<openssl rand -base64 32>
STORE_CORS=http://<ton-host-coolify>:8001,http://<ton-host-coolify>:9000
ADMIN_CORS=http://<ton-host-coolify>:8001,http://<ton-host-coolify>:9000
AUTH_CORS=http://<ton-host-coolify>:8001,http://<ton-host-coolify>:9000
```

> ⚠️ Remplace `<ton-host-coolify>` par l'IP/hostname réel
> (ex. `http://12.34.56.78:8001`). **Sans slash final**, séparés par
> des virgules.

### 4.4 Volumes (optionnel mais recommandé)

Monte un volume `backend-static` sur `/app/apps/backend/static`
→ c'est là que Medusa stocke les uploads par défaut (éphémères sinon).

### 4.5 Healthcheck

Coolify va utiliser le healthcheck défini dans le compose
(path `/health`). Laisse par défaut.

### 4.6 Déploiement

1. **Deploy** → le build tourne, puis le conteneur boot, fait
   `medusa db:migrate` puis `medusa start`.
2. Une fois "Healthy", crée le compte admin une fois pour toutes :
   - **Coolify → service backend → Terminal**
   - tape : `cd apps/backend && npx medusa user -e admin@2tijen.com -p TON-MOT-DE-PASSE`
3. Vérifie : `http://<ton-host>:9000/health` doit répondre
   `{"status":"ok"}` et `http://<ton-host>:9000/app` doit afficher
   le login admin.

---

## 5. Service (d) — Storefront Next.js

**Coolify → Service → Add → Application**

### 5.1 Build

| Champ | Valeur |
|---|---|
| Source | GitHub → ton repo |
| Branch | `main` |
| **Build Pack** | **Dockerfile** |
| **Dockerfile path** | `store/apps/storefront/Dockerfile` |
| **Base directory** | `store` |

### 5.2 Port

| Champ | Valeur |
|---|---|
| Container port | `8001` |
| **Host port** | `8001` |

> ⚠️ On évite `8000` parce qu'il est pris par l'UI Coolify.

### 5.3 Build Arguments

Coolify ne supporte pas les ARG Docker nativement. Tu as **deux
options** :

- **Option A (recommandée)** : ajoute une section **"Build Arguments"**
  dans les settings du service, avec ces valeurs :

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://<ton-host>:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_ta-clé-réelle
NEXT_PUBLIC_DEFAULT_REGION=gf
NEXT_PUBLIC_BASE_URL=http://<ton-host>:8001
NEXT_PUBLIC_HERO_VIDEO_URL=
NEXT_PUBLIC_HERO_LOGO_URL=
NEXT_PUBLIC_NEXT_DROP_DATE=
NEXT_PUBLIC_STRIPE_KEY=
BACKEND_UPSTREAM_URL=http://backend:9000
```

> `BACKEND_UPSTREAM_URL` doit pointer vers le **service Docker**
> interne (Coolify nomme le service `backend` par défaut, donc
> `http://backend:9000`).

> Si l'UI Coolify ne te permet pas de poser les ARG, passe par
> l'option B : ajoute les mêmes variables dans la section
> "Environment Variables" → Next.js les lira au BUILD également
> grâce au script `check-env-variables.js`. (Vérifie dans l'UI
> Coolify la présence du champ "Build Args" ; depuis v4.0 il
> existe.)

### 5.4 Variables d'environnement (runtime)

```
NODE_ENV=production
PORT=8001
HOSTNAME=0.0.0.0
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_ta-clé-réelle
```

### 5.5 Déploiement

1. **Deploy** → build Next.js (3-4 min), puis démarrage sur `8001`.
2. Ouvre `http://<ton-host>:8001/gf` → la home doit charger
   (hero + produits depuis l'API sur `:9000`).

> Le storefront converse avec le backend **via** `http://<ton-host>:9000`
> (URL publique, NEXT_PUBLIC_MEDUSA_BACKEND_URL) pour le SDK Medusa
> côté navigateur, **et** via `http://backend:9000` (URL privée,
> rewrites serveur) pour `/app`, `/admin`, `/store`, `/static`,
> `/health`.

---

## 6. Quand tu auras un nom de domaine

1. **DNS** : pointer `2tijen.com` (et `www`) vers l'IP de l'hôte Coolify.
2. **Coolify** :
   - Service backend (`:9000`) → onglets "Domains" → ajouter `api.2tijen.com` (Coolify générera le HTTPS via Let's Encrypt).
   - Service storefront (`:8001`) → ajouter `2tijen.com` et `www.2tijen.com`.
3. **Variables à mettre à jour puis redéployer** :

   Backend :
   ```
   STORE_CORS=https://2tijen.com,https://www.2tijen.com,https://api.2tijen.com
   ADMIN_CORS=https://2tijen.com
   AUTH_CORS=https://2tijen.com,https://www.2tijen.com
   ```

   Storefront (build args) :
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.2tijen.com
   NEXT_PUBLIC_BASE_URL=https://2tijen.com
   BACKEND_UPSTREAM_URL=http://backend:9000
   ```

4. Les URLs finales :

   | URL | Rôle |
   |---|---|
   | `https://2tijen.com/gf` | le site (Next.js) |
   | `https://2tijen.com/app` | l'admin Medusa (rewrites → backend) |
   | `https://api.2tijen.com/health` | healthcheck API |

---

## 7. Stockage des images (Cloudflare R2 — quand tu en auras besoin)

Le volume `backend-static` survit aux redéploiement Coolify, mais il
est **lié au service** et perdu si tu recrées le service. Pour un
vrai stockage durable (drops, produits), branche un bucket R2 :

1. **Cloudflare R2** → créer un bucket public + un token API.
2. Variables backend à ajouter puis redéployer :
   ```
   S3_BUCKET=2tijen
   S3_REGION=auto
   S3_ACCESS_KEY_ID=xxx
   S3_SECRET_ACCESS_KEY=xxx
   S3_PUBLIC_URL=https://cdn.ton-domaine.com   (ou l'URL publique R2)
   ```
3. Ré-uploader les images depuis l'admin (le widget "Drop" du
   `apps/backend/src/admin/widgets/`).

---

## 8. Check-list après déploiement

- [ ] `http://<host>:9000/health` → `ok`
- [ ] `http://<host>:9000/app` → login admin OK
- [ ] `http://<host>:8001/gf` → hero + liste des produits
- [ ] `http://<host>:8001/gf/store` → drop + produits détaillés
- [ ] Commande test (paiement manuel) jusqu'à confirmation
- [ ] (Ultérieur) Activer les **backups** Postgres dans Coolify
- [ ] (Ultérieur) Brancher R2 + domaine

---

## 9. Mises à jour

```
git add . && git commit -m "..." && git push
```

→ Coolify rebuild les services concernés (auto si tu as activé
"auto-deploy" sur la branche `main`).

Pour un changement de variable `NEXT_PUBLIC_*` côté storefront : il
faut **forcer un rebuild** (pas juste un restart) car ces variables
sont inlinées au build. Dans l'UI Coolify → service → "Force Rebuild"
ou changer puis "Deploy".

---

## 10. Dépannage

| Symptôme | Cause / solution |
|---|---|
| Backend restart en boucle, log `http.jwtSecret not found` | `JWT_SECRET` manquant → ajouter dans env et redéployer |
| Storefront healthcheck 503 | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` non inlinée → vérifier les **Build Args** |
| CORS error dans la console navigateur | `STORE_CORS`/`AUTH_CORS` ne contiennent pas l'URL exacte du storefront (avec `http://` et sans `/` final) |
| Storefront 404 sur `/app` | `BACKEND_UPSTREAM_URL` n'est pas résolu → doit être `http://backend:9000` (DNS interne Coolify) |
| Build Next.js échoue sur `generateStaticParams` | Backend pas encore UP → déployer d'abord le backend (le storefront appelle l'API au build pour pré-rendre les pages produits) |

