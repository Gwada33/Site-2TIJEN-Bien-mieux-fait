import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import {
  DropPresentation,
  DROP_TYPES,
} from "@lib/data/drop-presentation"
import FilterBar from "@modules/store/components/filter-bar"
import StoreHeroParallax from "@modules/store/components/hero-parallax"
import PaginatedProducts from "./paginated-products"

const ACCENT_TEXT: Record<DropPresentation["type"], string> = {
  drop: "text-or",
  capsule: "text-emeraude",
  archive: "text-ivoire/80",
}

// Badge sobre — bordure fine, pas de fond coloré.
const BADGE_CLASS: Record<DropPresentation["type"], string> = {
  drop: "border-or/30 text-or/70",
  capsule: "border-emeraude/30 text-emeraude/70",
  archive: "border-ivoire/30 text-ivoire/60",
}

const StoreTemplate = ({
  drop,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  drop: DropPresentation | null
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Pas de drop → message francisé.
  if (!drop) {
    return (
      <div className="content-container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <span className="kicker">{"// Aucun drop"}</span>
        <h1 className="font-display text-3xl uppercase leading-none text-ivoire small:text-5xl">
          Drop à venir
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ivoire/60">
          Aucune collection n&apos;est en ligne pour le moment. Reviens vite —
          le prochain drop arrive bientôt.
        </p>
        <LocalizedClientLink
          href="/"
          className="link-underline font-mono text-xs uppercase tracking-[0.2em] text-emeraude hover:text-ivoire"
        >
          Retour à l&apos;accueil →
        </LocalizedClientLink>
      </div>
    )
  }

  const config = DROP_TYPES[drop.type]

  return (
    <>
      {/* HERO — sticky sous la nav : les produits (z-10) et le footer (z-20)
          passent au-dessus. GSAP : parallaxe image + fondu contenu. */}
      <section
        id="le-drop"
        style={{ position: "sticky", top: "4rem", zIndex: 0 }}
        className="relative flex h-[60vh] min-h-[24rem] w-full items-center justify-center overflow-hidden bg-noir"
      >
        <StoreHeroParallax>
          {drop.image ? (
            <img
              src={drop.image}
              alt={drop.title}
              data-hero-parallax="image"
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
              className="absolute inset-0 h-full w-full scale-[1.35] p-4 small:p-10"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#1F3B2C,#0B0F0D)]" />
          )}

          {/* Titre discret en bas — fond, puis disparaît au scroll */}
          <div
            data-hero-parallax="content"
            className="absolute inset-x-0 bottom-0 z-10"
          >
            <div className="content-container flex flex-col gap-2 pb-5 small:pb-6">
              <h1
                data-testid="store-page-title"
                className="hero-enter-rise max-w-3xl font-display text-3xl uppercase leading-[0.95] tracking-tight text-ivoire small:text-5xl"
                style={{ animationDelay: "250ms" }}
              >
                {drop.title}
              </h1>
              <div
                className="hero-enter-fade flex flex-wrap items-center gap-3"
                style={{ animationDelay: "450ms" }}
              >
                <span
                  className={`inline-flex items-center border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] ${BADGE_CLASS[drop.type]}`}
                >
                  {config.badge}
                </span>
                {drop.productCount > 0 && (
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40">
                    {drop.productCount} pièces
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Indication de scroll — disparaît avec le contenu */}
          <div
            data-hero-parallax="content"
            className="hero-enter-fade absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-2 small:flex"
            style={{ animationDelay: "900ms" }}
            aria-hidden="true"
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ivoire/50">
              Scroll
            </span>
            <span className="hero-scroll-hint block h-8 w-px bg-gradient-to-b from-ivoire/70 to-transparent" />
          </div>
        </StoreHeroParallax>
      </section>

      {/* Section produits — recouvre le hero sticky au scroll */}
      <div
        style={{ position: "relative", zIndex: 10 }}
        className="bg-noir py-8 small:py-10"
        data-testid="category-container"
      >
        <div className="content-container">
          <FilterBar sortBy={sort} />

          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
              collectionId={drop.id}
            />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default StoreTemplate