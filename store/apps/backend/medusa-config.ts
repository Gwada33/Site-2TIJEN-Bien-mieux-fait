import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Optionnel : sans REDIS_URL, un event bus in-memory est utilisé (dev uniquement).
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: {
    /**
     * Stockage des fichiers (images de drops, produits…).
     * - En prod : définis S3_BUCKET + creds (Cloudflare R2 / AWS S3 / Scaleway) →
     *   les fichiers sont servis depuis S3_PUBLIC_URL.
     * - Sinon : provider local par défaut (fichiers sur disque, ÉPHÉMÈRE
     *   sur Railway / conteneurs).
     */
    ...(process.env.S3_BUCKET
      ? {
          [Modules.FILE]: {
            resolve: "@medusajs/file",
            options: {
              providers: [
                {
                  resolve: "@medusajs/file-s3",
                  options: {
                    fileUrl: process.env.S3_PUBLIC_URL!,
                    region: process.env.S3_REGION || "auto",
                    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                    bucket: process.env.S3_BUCKET!,
                  },
                },
              ],
            },
          },
        }
      : {}),
  },
})
