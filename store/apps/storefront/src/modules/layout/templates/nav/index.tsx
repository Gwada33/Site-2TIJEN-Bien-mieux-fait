import { Suspense } from "react"

import Image from "next/image"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { User } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const menuItems = [
  { name: "Shop", href: "/store" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 border-b border-ivoire/10 bg-noir/90 backdrop-blur-md">
        <nav className="content-container flex h-full w-full items-center justify-between">
          <div className="flex h-full flex-1 basis-0 items-center gap-3">
            <div className="small:hidden h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center transition-opacity duration-200 hover:opacity-80"
              data-testid="nav-store-link"
              aria-label="2TIJEN — Accueil"
            >
              <Image
                src="/2TIJEN.svg"
                alt="2TIJEN"
                width={575}
                height={593}
                className="h-7 w-auto small:h-8"
              />
            </LocalizedClientLink>
          </div>

          <ul className="hidden h-full items-center gap-8 small:flex">
            {menuItems.map((item) => (
              <li key={item.name} className="h-full">
                <LocalizedClientLink
                  href={item.href}
                  className="link-underline flex h-full items-center font-mono text-xs uppercase tracking-[0.2em] text-ivoire/70 hover:text-ivoire"
                >
                  {item.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          <div className="flex h-full flex-1 basis-0 items-center justify-end gap-5">
            <LocalizedClientLink
              className="hidden items-center text-ivoire/70 transition-colors hover:text-emeraude small:flex"
              href="/account"
              data-testid="nav-account-link"
              aria-label="Mon compte"
            >
              <User />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ivoire/70 hover:text-ivoire"
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
