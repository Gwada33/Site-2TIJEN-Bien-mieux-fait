import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h3 className="font-display text-2xl uppercase leading-none text-ivoire small:text-3xl">
          {collection.title}
        </h3>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="link-underline shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-emeraude hover:text-ivoire"
        >
          Tout voir
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-12 small:grid-cols-3 small:gap-x-6 small:gap-y-16">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
