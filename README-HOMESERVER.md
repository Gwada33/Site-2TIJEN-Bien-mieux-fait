# 2TIJEN — Home server (Podman + Cloudflare Tunnel)

Déploie toute la stack (Postgres + Redis + backend Medusa + storefront
Next.js) sur un serveur maison avec **Podman**, accessible à tous via un
**tunnel Cloudflare** (aucun port ouvert, HTTPS automatique, marche même
derrière CGNAT).

> Alternative hébergée : voir `store/DEPLOY.md` (Railway + Vercel).

---

## 1. Prérequis serveur

- Un ordinateur allumé en permanence (mini-PC, vieux portable, Raspberry Pi 5, Mac…)
- Fedora / Ubuntu / Debian recommandé — **2 Go de RAM minimum, 10 Go de disque**
- Podman + compose :

```bash
# Fedora
sudo dnf install podman podman-compose

# Ubuntu / Debian
sudo apt install podman podman-compose
```

- (Optionnel mais conseillé) le service systemd pour que la stack survive aux
  reboot :
  - rootless : `sudo loginctl enable-linger $USER` (permet les conteneurs
    rootless + `restart: unless-stopped` sans session ouverte)

---

## 2. Cloudflare (5 min — la seule étape "cloud")

1. Ajoute ton domaine sur **Cloudflare** (plan gratuit) → le DNS doit être géré
   par Cloudflare (change les nameservers chez ton registrar).
2. **Zero Trust** (`one.dash.cloudflare.com`) → **Networks → Tunnels → Create a
   tunnel** → choisis **Cloudflared** → donne-lui un nom (ex. `2tijen`) →
   Cloudflare affiche un **token** (`eyJ…`) → colle-le dans `.env`
   (`CLOUDFLARE_TUNNEL_TOKEN`).
3. Dans le tunnel, ajoute le **Public Hostname** :

| Hostname | Service |
|---|---|
| `2tijen.com` et `www.2tijen.com` | `http://storefront:8000` |

   > ⚠️ **Le backend reste privé** : tout le trafic passe par le storefront
   > (appels serveur, jamais depuis le navigateur). Ne crée **pas** de route
   > `api.…` dans le tunnel. Fais cette config **avant** le premier
   > déploiement : le build du storefront appelle le backend pendant
   > `next build`.

---

## 3. Premier déploiement

```bash
# 1. Clone le repo depuis GitHub
git clone <URL_DU_REPO> 2tijen
cd 2tijen

# 2. Environnement
cp .env.example .env
nano .env   # → remplis : CLOUDFLARE_TUNNEL_TOKEN, NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
            #   domaines si différents, secrets générés automatiquement sinon

# 3. Lancer (build + démarrage dans le bon ordre)
./deploy.sh
```

Le script :
1. `git pull` (mises à jour)
2. monte **postgres / redis / backend / cloudflared**
3. attend le healthcheck du backend (migrations auto au démarrage)
4. build puis démarre le **storefront**
5. affiche l'état des conteneurs

Résultat :

| URL | Rôle |
|---|---|
| `https://2tijen.com/gf` | le site (tunnel Cloudflare → storefront) |
| `http://localhost:9000/app` | l'admin Medusa (via `ssh -L 9000:localhost:9000`) |

---

## 4. Compte admin (une seule fois)

```bash
# Dans le conteneur backend
podman exec -it 2tijen_backend_1 npx medusa user -e admin@2tijen.com -p UN-MOT-DE-PASSE
# (ou : podman exec -it 2tijen-backend-1 … selon le provider compose)
```

### Accéder à l'admin (`/app`) — backend privé

Le backend n'est **jamais** exposé sur Internet. Pour ouvrir l'admin :

```bash
# Tunnel SSH vers la machine (depuis ton poste) :
ssh -L 9000:localhost:9000 user@serveur-maison
# puis ouvre http://localhost:9000/app dans ton navigateur
```

---

## 5. Mises à jour

1. Modifie le code → `git push` sur GitHub
2. Sur le serveur : `./deploy.sh` (pull + rebuild + restart)

Changement de variable `NEXT_PUBLIC_*` → même chose : `./deploy.sh`
(le build re-inline les valeurs).

---

## 6. Backups (à mettre en place)

Exemple de cron quotidien (sauvegarde Postgres dans `~/backups`) :

```bash
mkdir -p ~/backups
crontab -e
# Ligne à ajouter :
# 0 3 * * * podman exec $(podman ps --format '{{.Names}}' | grep -E '^2tijen[-_]postgres[-_][0-9]+$' | head -n1) pg_dump -U medusa medusa-store | gzip > ~/backups/medusa-$(date +\%F).sql.gz && find ~/backups -mtime +14 -delete
```

Le volume `pg-data` contient la base : `podman volume ls | grep pg-data`.

---

## 7. Stockage des images (R2 — **requis** avec backend privé)

Avec un backend privé, les URLs d'images servies par le backend local ne
seraient pas accessibles au navigateur. **Cloudflare R2 est donc requis** :

1. Crée un bucket **Cloudflare R2** public + un token API (Object Read & Write)
2. Remplis `S3_BUCKET`, `S3_PUBLIC_URL` (ex. `https://cdn.2tijen.com` ou l'URL
   publique R2), `S3_REGION=auto`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
   dans `.env`, puis `./deploy.sh` — le backend bascule sur R2 automatiquement
   (`store/apps/backend/medusa-config.ts`)
3. (Optionnel) ajoute un Public Hostname `cdn.2tijen.com` → `r2.dev` dans le
   tunnel pour servir les images via ton domaine
4. **Ré-uploader les images existantes** via l'admin (le widget « Drop »)

---

## 8. Dépannage

| Symptôme | Cause / solution |
|---|---|
| `./deploy.sh` échoue au build storefront | Tunnel pas encore configuré ou API pas en ligne → `podman logs` sur cloudflared + vérifie `https://api.2tijen.com/health` |
| 502 sur `https://2tijen.com` | Un conteneur down → `podman-compose ps` + `podman-compose logs -f backend` |
| CORS error dans la console | `STORE_CORS` / `AUTH_CORS` dans `.env` ne contiennent pas le domaine exact (avec `https://` et sans `/` final) → modifier + `./deploy.sh` |
| Erreurs SELinux (Fedora) | Les volumes du compose ont déjà `:Z` — si erreur persistante : `sudo setenforce 0` pour tester |
| Port déjà utilisé | Le compose n'expose **aucun port** sur l'hôte (seul le tunnel y accède) — vérifie qu'aucun `ports:` n'a été ajouté |
| Redis : event bus in-memory | Normal si `REDIS_URL` absent du `.env` — le compose fournit `redis://redis:6379` automatiquement |

---

## 9. Arrêt / redémarrage

```bash
podman-compose down          # arrête tout (les volumes restent)
podman-compose up -d         # redémarre
./deploy.sh                  # rebuild + redémarre
```
