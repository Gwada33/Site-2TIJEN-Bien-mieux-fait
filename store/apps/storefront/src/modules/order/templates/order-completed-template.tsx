import { Heading } from "@modules/common/components/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="min-h-[calc(100vh-64px)] py-10">
      <div className="content-container flex h-full w-full max-w-4xl flex-col items-center justify-center gap-y-10">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex h-full w-full max-w-4xl flex-col gap-8 rounded-[2px] border border-ivoire/10 bg-noir-lift p-6 small:p-10"
          data-testid="order-complete-container"
        >
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-emeraude">
              // Commande confirmée
            </span>
            <Heading
              level="h1"
              className="flex flex-col gap-2 text-4xl leading-[0.95] text-ivoire small:text-5xl"
            >
              <span>Merci !</span>
              <span>
                Votre commande a bien <span className="text-emeraude">été passée</span>.
              </span>
            </Heading>
          </div>

          <OrderDetails order={order} />

          <div className="flex flex-col gap-4">
            <Heading
              level="h2"
              className="flex items-center gap-3 text-xl text-ivoire"
            >
              <span className="h-px w-6 bg-emeraude" aria-hidden="true" />
              Récapitulatif
            </Heading>
            <Items order={order} />
            <CartTotals totals={order} />
          </div>

          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
