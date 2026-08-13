import { Suspense } from "react"

import Image from "next/image"

import { User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"

const menuItems = [
  { name: "Accueil", href: "/" },
  { name: "Catalogue", href: "/store" },
  { name: "Compte", href: "/account" },
]

/**
 * Navigation du store — logo 2TIJEN à gauche, menu central (Accueil / Le drop /
 * Compte), panier à droite. Barre basse translucide au scroll.
 */
export default async function StoreNav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 border-b border-ivoire/10 bg-noir/85 backdrop-blur-md">
        <nav className="content-container flex h-full w-full items-center justify-between">
          {/* Logo 2TIJEN → home */}
          <LocalizedClientLink
            href="/"
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
            aria-label="2TIJEN — Accueil"
            data-testid="nav-store-link"
          >
            <Image
              src="/2TIJEN.svg"
              alt="2TIJEN"
              width={575}
              height={593}
              className="h-6 w-auto small:h-7"
            />
          </LocalizedClientLink>

          {/* Menu central */}
          <ul className="flex items-center gap-6 small:gap-10">
            {menuItems.map((item) => (
              <li key={item.name}>
                <LocalizedClientLink
                  href={item.href}
                  className="link-underline font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ivoire/60 transition-colors hover:text-ivoire"
                >
                  {item.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          {/* Droite : compte + panier */}
          <div className="flex items-center gap-5">
            <LocalizedClientLink
              className="text-ivoire/60 transition-colors hover:text-emeraude"
              href="/account"
              aria-label="Mon compte"
              data-testid="nav-account-link"
            >
              <User className="h-5 w-5" />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ivoire/60 hover:text-ivoire"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Panier (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}