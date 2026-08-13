import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Commande — 2TIJEN",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="content-container grid grid-cols-1 gap-x-12 gap-y-10 py-10 small:grid-cols-[1fr_22rem] small:py-16">
      <div className="flex flex-col gap-y-10" data-testid="checkout-form">
        <h1 className="font-display text-3xl uppercase leading-none text-ivoire small:text-5xl">
          Finaliser la commande
        </h1>
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
      </div>
      <div className="border-l border-ivoire/15 pl-0 small:pl-8">
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}