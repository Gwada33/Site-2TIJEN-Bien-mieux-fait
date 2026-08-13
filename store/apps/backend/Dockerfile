# ---------------------------------------------------------------------------
# Backend Medusa 2TIJEN — Dockerfile
# Contexte de build : STORE/ (racine du workspace npm)
#   Railway → rootDirectory = "store", dockerfilePath = "apps/backend/Dockerfile"
# ---------------------------------------------------------------------------

# --- Étape 1 : installation des dépendances (workspace complet) ------------
FROM node:20-slim AS deps
WORKDIR /app

# Outils de build natifs (sharp, swc…)
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Lockfile + package.json de chaque workspace (pour npm ci)
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/storefront/package.json apps/storefront/package.json
RUN npm ci

# --- Étape 2 : build (TS + admin) ------------------------------------------
FROM deps AS build
COPY apps/backend apps/backend
RUN npm run build --workspace=@dtc/backend

# --- Étape 3 : runtime ------------------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9000

COPY --from=deps /app/package.json /app/package-lock.json ./
COPY --from=deps /app/node_modules node_modules
COPY --from=deps /app/apps/backend/node_modules apps/backend/node_modules
COPY --from=build /app/apps/backend apps/backend

EXPOSE 9000

# Migrations puis démarrage (migrations idempotentes)
CMD ["sh", "-c", "cd apps/backend && npx medusa db:migrate && npx medusa start"]
