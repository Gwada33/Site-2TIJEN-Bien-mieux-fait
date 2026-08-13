import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <section aria-labelledby="shipping-details-heading">
      <Heading
        level="h2"
        id="shipping-details-heading"
        className="flex items-center gap-3 text-xl text-ivoire"
      >
        <span className="h-px w-6 bg-emeraude" aria-hidden="true" />
        Livraison
      </Heading>

      <div className="mt-4 grid gap-6 small:grid-cols-3">
        <div
          className="flex flex-col gap-1"
          data-testid="shipping-address-summary"
        >
          <Text className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/50">
            Adresse de livraison
          </Text>
          <Text className="text-sm text-ivoire">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="text-sm text-ivoire/80">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="text-sm text-ivoire/80">
            {order.shipping_address?.postal_code}, {order.shipping_address?.city}
          </Text>
          <Text className="text-sm text-ivoire/80">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col gap-1"
          data-testid="shipping-contact-summary"
        >
          <Text className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/50">
            Contact
          </Text>
          <Text className="text-sm text-ivoire">
            {order.shipping_address?.phone}
          </Text>
          <Text className="text-sm text-ivoire/80">{order.email}</Text>
        </div>

        <div
          className="flex flex-col gap-1"
          data-testid="shipping-method-summary"
        >
          <Text className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/50">
            Méthode
          </Text>
          <Text className="text-sm text-ivoire">
            {(order.shipping_methods?.[0] as { name?: string })?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>

      <Divider className="mt-8" />
    </section>
  )
}

export default ShippingDetails
