import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"

export type DropType = "drop" | "capsule" | "archive"

export type DropPresentation = {
  id: string
  handle: string
  title: string
  type: DropType
  subtitle: string | null
  /** Image de présentation du drop (URL). */
  image: string | null
  /** Nombre de pièces dans le drop. */
  productCount: number
}

/**
 * Définition des types de drop — pilotent la présentation du hero du catalogue.
 *
 * Le type est stocké dans `product_collection.metadata.drop_type` (admin Medusa).
 * Valeurs attendues : "drop" | "capsule" | "archive". Toute autre valeur → "drop".
 */
export const DROP_TYPES: Record<
  DropType,
  { label: string; badge: string; kicker: string; accent: "or" | "emeraude" | "ivoire" }
> = {
  drop: {
    label: "DROP",
    badge: "ÉDITION LIMITÉE",
    kicker: "// Le drop",
    accent: "or",
  },
  capsule: {
    label: "CAPSULE",
    badge: "CAPSULE",
    kicker: "// La capsule",
    accent: "emeraude",
  },
  archive: {
    label: "ARCHIVE",
    badge: "ARCHIVE",
    kicker: "// L'archive",
    accent: "ivoire",
  },
}

const parseDropType = (value: unknown): DropType => {
  if (value === "capsule" || value === "archive") return value
  return "drop"
}

/**
 * Renvoie le drop courant = la collection la plus récemment mise à jour.
 *
 * La présentation (image, type, sous-titre) se lit dans `metadata` de la
 * collection (champs `drop_image`, `drop_type`, `drop_subtitle`). Si
 * `drop_image` n'est pas renseigné, on reconnecte automatiquement la première
 * image produit de la collection — zéro config côté admin si tu n'as pas de
 * visuel dédié.
 *
 * Lecture `no-store` : le drop affiché suit toujours la dernière collection
 * modifiée dans l'admin, sans rebuild.
 */
export async function getCurrentDrop(
  countryCode: string
): Promise<{ drop: DropPresentation | null }> {
  try {
    const region = await getRegion(countryCode)
    if (!region) return { drop: null }

    const { collections } = await sdk.client.fetch<{
      collections: (HttpTypes.StoreCollection & { updated_at?: string })[]
    }>("/store/collections", {
      method: "GET",
      query: { fields: "id,handle,title,metadata,updated_at", limit: "100" },
      cache: "no-store",
    })

    if (!collections?.length) return { drop: null }

    const sorted = [...collections].sort(
      (a, b) =>
        new Date(b.updated_at ?? 0).getTime() -
        new Date(a.updated_at ?? 0).getTime()
    )
    const collection = sorted[0]
    const meta = (collection.metadata ?? {}) as Record<string, unknown>
    const customImage = (meta.drop_image as string) || null

    // Un seul produit suffit pour reconnecter une image automatiquement.
    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>("/store/products", {
      method: "GET",
      query: {
        limit: 1,
        region_id: region.id,
        collection_id: [collection.id],
        fields: "id,thumbnail,*images.url",
      },
      cache: "no-store",
    })

    const image =
      customImage ||
      products?.[0]?.thumbnail ||
      products?.[0]?.images?.[0]?.url ||
      null

    // Compte réel des pièces du drop (pour le hero).
    const { count } = await sdk.client.fetch<{ count: number }>(
      "/store/products",
      {
        method: "GET",
        query: {
          limit: 0,
          region_id: region.id,
          collection_id: [collection.id],
        },
        cache: "no-store",
      }
    )

    return {
      drop: {
        id: collection.id,
        handle: collection.handle,
        title: collection.title,
        type: parseDropType(meta.drop_type),
        subtitle: (meta.drop_subtitle as string) || null,
        image,
        productCount: count ?? 0,
      },
    }
  } catch (error) {
    console.error("getCurrentDrop: impossible de lire le drop courant", error)
    return { drop: null }
  }
}