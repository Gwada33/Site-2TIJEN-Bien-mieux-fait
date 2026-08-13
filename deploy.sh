#!/usr/bin/env bash
# ============================================================
# 2TIJEN — Déploiement home server (Podman + Cloudflare Tunnel)
#
# Usage :
#   1re fois (depuis une machine vierge) :
#     git clone <URL_DU_REPO> 2tijen && cd 2tijen
#     cp .env.example .env   # puis remplis .env
#     ./deploy.sh
#
#   Mises à jour (après un git push) :
#     ./deploy.sh
#
# Ordre : git pull → infra + backend + tunnel → attente du backend →
#         build storefront (next build appelle le backend en ligne).
# ============================================================
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

# Nom de projet compose stable (le dossier parent peut contenir des espaces)
export COMPOSE_PROJECT_NAME=2tijen

# --- Détection de l'outil compose ------------------------------------------
if command -v podman-compose >/dev/null 2>&1; then
  COMPOSE=(podman-compose)
elif command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
  COMPOSE=(podman compose)
else
  echo "❌ Podman + compose requis."
  echo "   Fedora : sudo dnf install podman podman-compose"
  echo "   Ubuntu : sudo apt install podman podman-compose"
  exit 1
fi
echo "ℹ️  Compose : ${COMPOSE[*]}"

# --- 1. Récupérer les dernières sources depuis GitHub ------------------------
if [ -d .git ]; then
  echo "⟳ git pull…"
  git pull --ff-only
else
  echo "❌ Pas de repo git ici — commence par :"
  echo "   git clone <URL_DU_REPO> 2tijen && cd 2tijen && ./deploy.sh"
  exit 1
fi

# --- 2. Environnement ---------------------------------------------------------
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i "s/^POSTGRES_PASSWORD=change-me-strong-password$/POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=')/" .env
  sed -i "s/^JWT_SECRET=change-me-32-bytes-random$/JWT_SECRET=$(openssl rand -base64 32)/" .env
  sed -i "s/^COOKIE_SECRET=change-me-32-bytes-random$/COOKIE_SECRET=$(openssl rand -base64 32)/" .env
  echo "⚠️  .env créé avec des secrets générés."
  echo "   Remplis les variables restantes (CLOUDFLARE_TUNNEL_TOKEN,"
  echo "   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY, domaines…) puis relance ./deploy.sh"
  exit 1
fi

TOKEN="$(grep '^CLOUDFLARE_TUNNEL_TOKEN=' .env | cut -d= -f2- || true)"
if [ -z "$TOKEN" ] || [ "$TOKEN" = "eyJhIjoi…" ]; then
  echo "⚠️  CLOUDFLARE_TUNNEL_TOKEN manquant dans .env."
  echo "   Crée le tunnel : Cloudflare Zero Trust → Networks → Tunnels → Create."
  echo "   Puis configure les Public Hostnames :"
  echo "     www → http://storefront:8000      api → http://backend:9000"
  echo "   (sans tunnel, le build storefront échouera : il appelle l'API publique)"
  echo ""
fi

# --- 3. Infra + backend + tunnel ----------------------------------------------
echo "🚀 Démarrage postgres / redis / backend / cloudflared…"
"${COMPOSE[@]}" up -d --build postgres redis backend cloudflared

# --- 4. Attendre que le backend soit sain -------------------------------------
echo "⏳ Attente du backend (healthcheck)…"
PODMAN_BIN="$(command -v podman)"
backend_ok=0
for _ in $(seq 1 40); do
  ctr="$("${PODMAN_BIN}" ps --format '{{.Names}}' | grep -E '^2tijen[-_]backend[-_][0-9]+$' | head -n1 || true)"
  if [ -n "$ctr" ] && "${PODMAN_BIN}" exec "$ctr" node -e \
      "fetch('http://localhost:9000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    backend_ok=1
    break
  fi
  sleep 5
done

if [ "$backend_ok" -ne 1 ]; then
  echo "❌ Backend non sain après 200 s — logs :"
  "${COMPOSE[@]}" logs --tail 50 backend
  exit 1
fi
echo "✅ Backend opérationnel."

# --- 5. Storefront (build → l'API doit répondre via le tunnel) -----------------
echo "🚀 Build + démarrage du storefront…"
"${COMPOSE[@]}" up -d --build storefront

# --- 6. Récapitulatif -----------------------------------------------------------
echo ""
echo "✅ Déploiement terminé."
"${COMPOSE[@]}" ps
echo ""
echo "   Site   : https://2tijen.com  (www + apex, via le tunnel)"
echo "   Admin  : https://api.2tijen.com/app"
echo "   API    : https://api.2tijen.com/health"
echo ""
echo "   Logs : ${COMPOSE[*]} logs -f backend   (ou storefront / cloudflared)"
