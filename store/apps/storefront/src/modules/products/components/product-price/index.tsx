import { clx } from "@modules/common/components/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block h-9 w-32 animate-pulse bg-ivoire/10" />
  }

  return (
    <div className="flex flex-col gap-1 font-mono">
      <span
        className={clx("text-2xl tabular-nums text-ivoire", {
          "text-or": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "Dès "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <p className="flex items-center gap-2 text-xs">
          <span className="text-ivoire/40">Prix initial</span>
          <span
            className="text-ivoire/40 line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="text-or">-{selectedPrice.percentage_diff}%</span>
        </p>
      )}
    </div>
  )
}