import { clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <span
          className="line-through text-ivoire/40"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clx("font-mono text-sm text-ivoire", {
          "text-or": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </>
  )
}
