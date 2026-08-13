"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Informations",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Livraison & retours",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full border-t border-ivoire/10 pt-2">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-ivoire/60">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40">
            Matière
          </span>
          <p className="text-sm text-ivoire/80">
            {product.material ? product.material : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40">
            Origine
          </span>
          <p className="text-sm text-ivoire/80">
            {product.origin_country ? product.origin_country : "Guadeloupe"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40">
            Type
          </span>
          <p className="text-sm text-ivoire/80">
            {product.type ? product.type.value : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40">
            Poids
          </span>
          <p className="text-sm text-ivoire/80">
            {product.weight ? `${product.weight} g` : "—"}
          </p>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-6">
      <div className="flex flex-col gap-y-6 text-ivoire/70">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40">
            Expédition
          </span>
          <p className="max-w-sm text-sm leading-relaxed">
            Expédié depuis la Guadeloupe sous 48h ouvrées. Livraison offerte
            dès 120€ d&apos;achat.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40">
            Échanges
          </span>
          <p className="max-w-sm text-sm leading-relaxed">
            Échange possible sous 14 jours, pièce non portée et étiquetée. Les
            drops limités ne sont pas remboursés sauf défaut constaté.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs