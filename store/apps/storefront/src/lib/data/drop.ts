"use server"

import { heroConfig } from "@lib/config"
import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"

export type DropStatus = {
  /** true si au moins un produit est réellement vendable (stock > 0). */
  active: boolean
  /** Date ISO du prochain drop (null = non renseignée). */
  nextDropAt: string | null
}

/**
 * État du drop courant.
 *
 * Un drop est considéré ACTIF si au moins un produit a une variante avec du
 * stock disponible (ou en backorder).
 *
 * ⚠️ `no-store` volontaire : la bascule « drop en cours ↔ chrono » doit être
 * fraîche à chaque rendu (le cache du catalogue reste inchangé). À revoir
 * quand l'utilisateur aura défini où stocker les infos du drop côté backend —
 * on pourra alors revalider via `revalidateTag` au lieu d'un hit par requête.
 */
export async function getDropStatus(countryCode: string): Promise<DropStatus> {
  try {
    const region = await getRegion(countryCode)

    if (!region) {
      return { active: false, nextDropAt: heroConfig.nextDropDate || null }
    }

    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>("/store/products", {
      method: "GET",
      query: {
        limit: 100,
        region_id: region.id,
        fields:
          "id,title,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder",
      },
      cache: "no-store",
    })

    const active = (products || []).some((product) =>
      product.variants?.some(
        (variant) =>
          (variant.inventory_quantity ?? 0) > 0 ||
          variant.allow_backorder === true
      )
    )

    return {
      active,
      nextDropAt: heroConfig.nextDropDate || null,
    }
  } catch (error) {
    console.error("getDropStatus: impossible de lire l'état du drop", error)
    // En cas d'erreur, on ne bloque jamais la home : pas de drop actif.
    return {
      active: false,
      nextDropAt: heroConfig.nextDropDate || null,
    }
  }
}
