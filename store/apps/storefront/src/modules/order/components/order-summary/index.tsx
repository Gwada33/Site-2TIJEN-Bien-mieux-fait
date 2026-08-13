import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/ui"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <section aria-labelledby="order-summary-heading">
      <Heading
        level="h2"
        id="order-summary-heading"
        className="flex items-center gap-3 text-xl text-ivoire"
      >
        <span className="h-px w-6 bg-emeraude" aria-hidden="true" />
        Résumé
      </Heading>

      <div className="mt-4 flex flex-col gap-2 font-mono text-sm">
        <div className="flex items-center justify-between text-ivoire/80">
          <span>Sous-total</span>
          <span className="tabular-nums text-ivoire">
            {getAmount(order.subtotal)}
          </span>
        </div>
        {order.discount_total > 0 && (
          <div className="flex items-center justify-between text-ivoire/80">
            <span>Réduction</span>
            <span className="tabular-nums text-emeraude">
              - {getAmount(order.discount_total)}
            </span>
          </div>
        )}
        {order.gift_card_total > 0 && (
          <div className="flex items-center justify-between text-ivoire/80">
            <span>Carte cadeau</span>
            <span className="tabular-nums text-emeraude">
              - {getAmount(order.gift_card_total)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-ivoire/80">
          <span>Livraison</span>
          <span className="tabular-nums text-ivoire">
            {getAmount(order.shipping_total)}
          </span>
        </div>
        <div className="flex items-center justify-between text-ivoire/80">
          <span>Taxes</span>
          <span className="tabular-nums text-ivoire">
            {getAmount(order.tax_total)}
          </span>
        </div>
        <div className="my-2 h-px w-full border-t border-dashed border-ivoire/15" />
        <div className="flex items-center justify-between">
          <span className="font-display text-base uppercase tracking-[0.1em] text-ivoire">
            Total
          </span>
          <span className="text-lg tabular-nums text-ivoire">
            {getAmount(order.total)}
          </span>
        </div>
      </div>
    </section>
  )
}

export default OrderSummary
