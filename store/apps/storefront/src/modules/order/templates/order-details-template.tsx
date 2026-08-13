"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl uppercase leading-none tracking-[0.06em] text-ivoire small:text-3xl">
          Détails de la commande
        </h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ivoire/60 transition-colors hover:text-emeraude"
          data-testid="back-to-overview-button"
        >
          <XMark /> Retour aux commandes
        </LocalizedClientLink>
      </div>
      <div
        className="flex h-full flex-col gap-8 rounded-[2px] border border-ivoire/10 bg-noir-lift p-6 small:p-10"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
