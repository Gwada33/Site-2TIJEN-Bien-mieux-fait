"use client"

import { useState, useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@lib/util/product-option-filters"
import SortProducts, { SortOptions } from "../refinement-list/sort-products"
import { ChevronDownMini } from "@medusajs/icons"

type FilterBarProps = {
  sortBy: SortOptions
  /** Options produits (tailles…) chargées côté serveur — le backend reste privé. */
  options: HttpTypes.StoreProductOption[]
  "data-testid"?: string
}

/**
 * Barre de filtres horizontale et compacte — remplace la sidebar RefinementList.
 *
 * Une seule ligne : tri à gauche, bouton « Filtres » à droite qui déploie un
 * panneau avec les options produits (taille, etc.) en chips. Les options sont
 * multitokens dans l'URL (`option_value_id`), comme l'ancien OptionsPicker.
 * Les options arrivent en prop depuis le serveur (aucun appel API navigateur).
 */
const FilterBar = ({
  sortBy,
  options,
  "data-testid": dataTestId,
}: FilterBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)

  const updateQueryParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)
      params.delete("page")
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname, router, searchParams]
  )

  const selectedValueIds = useMemo(
    () => parseOptionValueIds(searchParams),
    [searchParams]
  )

  const toggleValue = (valueId: string) => {
    updateQueryParams((params) => {
      const next = selectedValueIds.includes(valueId)
        ? selectedValueIds.filter((id) => id !== valueId)
        : [...selectedValueIds, valueId]
      params.delete(OPTION_VALUE_QUERY_KEY)
      next.forEach((id) => params.append(OPTION_VALUE_QUERY_KEY, id))
    })
  }

  const setSort = (value: string) =>
    updateQueryParams((params) => params.set("sortBy", value))

  const hasActiveFilters = selectedValueIds.length > 0
  const clearFilters = () =>
    updateQueryParams((params) => params.delete(OPTION_VALUE_QUERY_KEY))

  return (
    <div className="mb-8 flex flex-col gap-3" data-testid={dataTestId}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivoire/10 pb-3">
        <SortProducts sortBy={sortBy} setQueryParams={setSort} />

        {options.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="group inline-flex items-center gap-2 border border-ivoire/15 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ivoire/70 transition-colors hover:border-ivoire/40 hover:text-ivoire"
            aria-expanded={open}
          >
            Filtres
            {hasActiveFilters && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center bg-emeraude px-1 text-[0.6rem] text-white">
                {selectedValueIds.length}
              </span>
            )}
            <ChevronDownMini
              className={clx(
                "transition-transform duration-150",
                open && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {open && options.length > 0 && (
        <div className="flex flex-col gap-5 py-2">
          {options.map((option) => {
            const values =
              option.values
                ?.map((v) => ({ id: v.id, label: v.value }))
                .filter(
                  (v): v is { id: string; label: string } => !!v.id && !!v.label
                ) || []
            if (!values.length) return null

            return (
              <div key={option.id} className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ivoire/40">
                  {option.title || "Option"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const isSelected = selectedValueIds.includes(value.id)
                    return (
                      <button
                        key={value.id}
                        onClick={() => toggleValue(value.id)}
                        className={clx(
                          "border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors duration-150",
                          {
                            "border-emeraude bg-emeraude text-white": isSelected,
                            "border-ivoire/15 text-ivoire/60 hover:border-ivoire/40 hover:text-ivoire":
                              !isSelected,
                          }
                        )}
                        aria-pressed={isSelected}
                      >
                        {value.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="self-start font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivoire/40 transition-colors hover:text-ivoire"
            >
              Effacer les filtres →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterBar