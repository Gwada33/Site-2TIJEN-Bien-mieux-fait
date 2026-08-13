# ---------------------------------------------------------------------------
# Storefront Next.js 2TIJEN — Dockerfile
# Contexte de build : STORE/ (racine du workspace npm)
# Service Coolify : port 8001 (8000 est pris par l'UI Coolify).
# ---------------------------------------------------------------------------

# --- Étape 1 : installation des dépendances (workspace complet) ------------
FROM node:20-slim AS deps
WORKDIR /app

# Outils de build natifs (sharp, swc…)
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/storefront/package.json apps/storefront/package.json
RUN npm ci

# --- Étape 2 : build Next.js (standalone) -----------------------------------
FROM deps AS build

# Variables inlinées au build (NEXT_PUBLIC_* → fournies par compose, ARG/ENV)
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_DEFAULT_REGION
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_HERO_VIDEO_URL
ARG NEXT_PUBLIC_HERO_LOGO_URL
ARG NEXT_PUBLIC_NEXT_DROP_DATE
ARG NEXT_PUBLIC_STRIPE_KEY
# URL INTERNE du backend pour les rewrites (/app /admin /store /static /health)
# ex. http://backend:9000 (réseau compose Coolify).
ARG BACKEND_UPSTREAM_URL

ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
    NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_HERO_VIDEO_URL=$NEXT_PUBLIC_HERO_VIDEO_URL \
    NEXT_PUBLIC_HERO_LOGO_URL=$NEXT_PUBLIC_HERO_LOGO_URL \
    NEXT_PUBLIC_NEXT_DROP_DATE=$NEXT_PUBLIC_NEXT_DROP_DATE \
    NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY \
    BACKEND_UPSTREAM_URL=$BACKEND_UPSTREAM_URL

COPY apps/storefront apps/storefront
RUN npm run build --workspace=@dtc/storefront

# L'output standalone préserve le chemin absolu du monorepo → on copie
# static/public au même endroit que server.js (indépendant du chemin).
RUN APP_DIR="$(dirname "$(find /app/apps/storefront/.next/standalone -name server.js -not -path '*/node_modules/*' | head -n1)")" \
  && mkdir -p "$APP_DIR/.next" \
  && cp -a /app/apps/storefront/.next/static "$APP_DIR/.next/static" \
  && cp -a /app/apps/storefront/public "$APP_DIR/public" \
  && echo "standalone normalisé : $APP_DIR"

# --- Étape 3 : runtime -------------------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8001 \
    HOSTNAME=0.0.0.0

COPY --from=build /app/apps/storefront/.next/standalone ./

EXPOSE 8001

# Localise server.js dynamiquement (chemin monorepo variable) puis démarre
CMD ["sh", "-c", "cd \"$(dirname \"$(find . -name server.js -not -path '*/node_modules/*' | head -n1)\")\" && node server.js"]
