import { Badge } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const isLimited = product.metadata?.limited === "true"

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="flex flex-col gap-3">
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {isLimited && (
            <Badge
              color="limited"
              className="animate-pulse-limited absolute left-2 top-2"
            >
              Limited
            </Badge>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span
              className="truncate text-sm text-ivoire transition-colors group-hover:text-emeraude"
              data-testid="product-title"
            >
              {product.title}
            </span>
            {product.collection?.title && (
              <span className="truncate font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ivoire/40">
                {product.collection.title}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}