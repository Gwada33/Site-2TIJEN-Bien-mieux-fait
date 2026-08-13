import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

// URL du backend : d'abord la variable serveur (interne, ex. http://backend:9000),
// puis la variable publique inlinée au build (fallback navigateur), puis localhost.
let MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

/**
 * Config du hero / drop.
 *
 * TODO(backend): quand l'utilisateur aura défini où stocker les infos du drop
 * (endpoint custom `/store/drop` ou settings Medusa), basculer la lecture de
 * `nextDropDate` et des médias vers le backend. Pour l'instant tout passe par
 * des variables d'environnement — un seul fichier à changer plus tard.
 */
export const heroConfig = {
  /**
   * URL de la vidéo animée du hero (MP4/WebM, plein écran).
   * Fallback : vidéo Shopify (celle fournie pour le hero).
   */
  videoUrl:
    process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
    "https://cdn.shopify.com/videos/c/o/v/375027fc8d1c4096adb00a4ad08b834d.mp4",
  /**
   * Logo du hero — par défaut le logo officiel local `public/2TIJEN.svg`.
   * La variable d'env permet de le remplacer par un hôte externe.
   */
  logoUrl: process.env.NEXT_PUBLIC_HERO_LOGO_URL || "/2TIJEN.svg",
  /** Date ISO du prochain drop (ex. "2026-09-01T18:00:00Z"). Vide → date à annoncer. */
  nextDropDate: process.env.NEXT_PUBLIC_NEXT_DROP_DATE || "",
}

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  const newHeaders = {
    ...localeHeader,
    ...headers,
  }
  init = {
    ...init,
    headers: newHeaders,
  }
  return originalFetch(input, init)
}
