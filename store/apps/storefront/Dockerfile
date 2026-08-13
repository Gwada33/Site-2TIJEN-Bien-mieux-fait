# ---------------------------------------------------------------------------
# Storefront Next.js 2TIJEN — Dockerfile
# Contexte de build : STORE/ (racine du workspace npm)
#   (même pattern que le backend : npm ci au niveau workspace)
# ---------------------------------------------------------------------------

# --- Étape 1 : installation des dépendances (workspace complet) ------------
FROM node:20-slim AS deps
WORKDIR /app

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

ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
    NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_HERO_VIDEO_URL=$NEXT_PUBLIC_HERO_VIDEO_URL \
    NEXT_PUBLIC_HERO_LOGO_URL=$NEXT_PUBLIC_HERO_LOGO_URL \
    NEXT_PUBLIC_NEXT_DROP_DATE=$NEXT_PUBLIC_NEXT_DROP_DATE \
    NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY

COPY apps/storefront apps/storefront
RUN npm run build --workspace=@dtc/storefront

# L'output standalone préserve le chemin absolu du monorepo → on copie
# static/public au même endroit que server.js (indépendant du chemin).
RUN APP_DIR="$(dirname "$(find /app/apps/storefront/.next/standalone -name server.js -not -path '*/node_modules/*' | head -n1)")" \
  && mkdir -p "$APP_DIR/.next" \
  && cp -a /app/apps/storefront/.next/static "$APP_DIR/.next/static" \
  && cp -a /app/apps/storefront/public "$APP_DIR/public" \
  && echo "standalone normalisé : $APP_DIR"

# --- Étape 3 : runtime ------------------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/storefront/.next/standalone ./

EXPOSE 8000

# Localise server.js dynamiquement (chemin monorepo variable) puis démarre
CMD ["sh", "-c", "cd \"$(dirname \"$(find . -name server.js -not -path '*/node_modules/*' | head -n1)\")\" && PORT=8000 HOSTNAME=0.0.0.0 node server.js"]
