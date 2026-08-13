const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * URL "cachée" du backend Medusa (Railway).
 * Le storefront parle à SON propre domaine : Vercel redirige /app, /admin,
 * /store, /static et /health vers ce backend. En local, on retombe sur
 * http://localhost:9000 (aucune config requise en dev).
 */
const MEDUSA_UPSTREAM_URL =
  process.env.BACKEND_UPSTREAM_URL || "http://localhost:9000"

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // Sortie autonome pour le déploiement Docker (image légère, sans node_modules complet)
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      // Logo du hero : le lien sera fourni par l'utilisateur (hôte quelconque).
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
  // Un seul port/domaine : l'admin (/app), l'API (/store), les images
  // (/static) et le healthcheck sont redirigés vers le backend Railway.
  async rewrites() {
    return [
      { source: "/app/:path*", destination: `${MEDUSA_UPSTREAM_URL}/app/:path*` },
      { source: "/admin/:path*", destination: `${MEDUSA_UPSTREAM_URL}/admin/:path*` },
      { source: "/store/:path*", destination: `${MEDUSA_UPSTREAM_URL}/store/:path*` },
      { source: "/static/:path*", destination: `${MEDUSA_UPSTREAM_URL}/static/:path*` },
      { source: "/health", destination: `${MEDUSA_UPSTREAM_URL}/health` },
    ]
  },
}

module.exports = nextConfig
