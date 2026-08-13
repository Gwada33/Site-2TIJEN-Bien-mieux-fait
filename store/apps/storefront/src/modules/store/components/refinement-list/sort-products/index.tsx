"use client"

import { clx } from "@modules/common/components/ui"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const sortOptions = [
  { value: "created_at", label: "Nouveautés" },
  { value: "price_asc", label: "Prix ↑" },
  { value: "price_desc", label: "Prix ↓" },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-testid={dataTestId}
    >
      <span className="mr-1 font-mono text-xs uppercase tracking-[0.2em] text-ivoire/40">
        Trier
      </span>
      {sortOptions.map((option) => {
        const isActive = sortBy === option.value

        return (
          <button
            key={option.value}
            onClick={() => setQueryParams("sortBy", option.value)}
            className={clx(
              "border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors duration-150",
              {
                "border-emeraude bg-emeraude text-white": isActive,
                "border-ivoire/15 text-ivoire/60 hover:border-ivoire/40 hover:text-ivoire":
                  !isActive,
              }
            )}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SortProducts