import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-noir relative small:min-h-screen">
      <div className="h-14 border-b border-ivoire/10">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 font-mono text-xs uppercase tracking-[0.15em] text-ivoire/60 hover:text-ivoire"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Retour au panier</span>
            <span className="block small:hidden">Retour</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="font-display text-sm uppercase tracking-[0.25em] text-ivoire hover:text-emeraude"
            data-testid="store-link"
          >
            2TIJEN
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}