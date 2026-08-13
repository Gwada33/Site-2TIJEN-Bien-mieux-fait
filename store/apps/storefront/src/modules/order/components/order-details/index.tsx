import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col gap-1 border-y border-ivoire/10 py-4">
      <Text className="text-sm text-ivoire/80">
        Nous avons envoyé la confirmation à{" "}
        <span
          className="font-semibold text-emeraude"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="font-mono text-xs uppercase tracking-[0.15em] text-ivoire/60">
        Date de commande :{" "}
        <span className="normal-case tracking-normal text-ivoire" data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </Text>
      <Text className="font-mono text-xs uppercase tracking-[0.15em] text-ivoire/60">
        Commande n° :{" "}
        <span
          className="font-semibold normal-case tracking-normal text-emeraude"
          data-testid="order-id"
        >
          {order.display_id}
        </span>
      </Text>

      {showStatus && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
          <Text className="font-mono text-xs uppercase tracking-[0.15em] text-ivoire/60">
            Statut :{" "}
            <span className="text-ivoire" data-testid="order-status">
              {formatStatus(order.fulfillment_status)}
            </span>
          </Text>
          <Text className="font-mono text-xs uppercase tracking-[0.15em] text-ivoire/60">
            Paiement :{" "}
            <span className="text-ivoire" data-testid="order-payment-status">
              {formatStatus(order.payment_status)}
            </span>
          </Text>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
