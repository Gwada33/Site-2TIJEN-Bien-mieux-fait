import { MedusaContainer } from "@medusajs/framework/types"

/**
 * One-off : nettoie les références « 971 » du sous-titre de drop stocké
 * dans la metadata de la collection active.
 */
export default async function fixDropSubtitle({
  container,
}: {
  container: MedusaContainer
}) {
  const productModule = container.resolve("product")

  await productModule.updateProductCollections(
    { id: "pcol_01KZS93H3HJA1C47E3ZHK4XAW8" },
    {
      metadata: {
        drop_subtitle: "Sérigraphie locale · édition limitée",
      },
    }
  )

  console.log("drop_subtitle mis à jour — plus de référence 971")
}
