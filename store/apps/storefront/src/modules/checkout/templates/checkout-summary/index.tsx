import { HttpTypes } from "@medusajs/types"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <aside className="flex flex-col-reverse gap-y-6 py-8 small:sticky small:top-14 small:flex-col small:py-0">
      <div className="flex w-full flex-col gap-y-6">
        <h2 className="font-display text-xl uppercase tracking-[0.1em] text-ivoire">
          Dans ton panier
        </h2>
        <div className="h-px w-full border-t border-ivoire/15" />
        <ItemsPreviewTemplate cart={cart} />
        <div>
          <CartTotals totals={cart} />
        </div>
        <div>
          <DiscountCode cart={cart} />
        </div>
      </div>
    </aside>
  )
}

export default CheckoutSummary