import { Container, Heading, Text } from "@modules/common/components/ui"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <section aria-labelledby="payment-details-heading">
      <Heading
        level="h2"
        id="payment-details-heading"
        className="flex items-center gap-3 text-xl text-ivoire"
      >
        <span className="h-px w-6 bg-emeraude" aria-hidden="true" />
        Paiement
      </Heading>
      <div className="mt-4">
        {payment && (
          <div className="grid w-full gap-6 small:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Text className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/50">
                Moyen de paiement
              </Text>
              <Text
                className="text-sm text-ivoire"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>
            <div className="flex flex-col gap-2 small:col-span-2">
              <Text className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/50">
                Détails du paiement
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <Container className="flex h-8 w-fit items-center border-ivoire/15 bg-ivoire/10 p-2">
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>
                <Text
                  className="text-sm text-ivoire"
                  data-testid="payment-amount"
                >
                  {isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} payé le ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleDateString("fr-FR")}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </section>
  )
}

export default PaymentDetails
