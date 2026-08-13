"use client"

import { useEffect, useState } from "react"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"

type OptionsPickerProps = {
  selectedValueIds: string[]
  setOptionValueIds: (valueIds: string[]) => void
}

const OptionsPicker = ({
  selectedValueIds,
  setOptionValueIds,
}: OptionsPickerProps) => {
  const [options, setOptions] = useState<HttpTypes.StoreProductOption[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_options?: HttpTypes.StoreProductOption[]
        }>("/store/product-options", {
          method: "GET",
          query: {
            is_exclusive: false,
            fields: "*values",
          },
        })

        if (response?.product_options) {
          setOptions(response.product_options)
        }
      } catch (error) {
        console.error("Failed to fetch product options", error)
      }
    }

    fetchOptions()
  }, [])

  if (!options.length) {
    return null
  }

  const toggleValue = (valueId: string) => {
    const isSelected = selectedValueIds.includes(valueId)
    const nextSelections = isSelected
      ? selectedValueIds.filter((id) => id !== valueId)
      : [...selectedValueIds, valueId]

    setOptionValueIds(Array.from(new Set(nextSelections)))
  }

  return (
    <div className="flex flex-col gap-5">
      {options.map((option) => {
        const values =
          option.values
            ?.map((value) => ({
              id: value.id,
              label: value.value,
            }))
            .filter(
              (value): value is { id: string; label: string } =>
                !!value.id && !!value.label
            ) || []

        if (!values.length) {
          return null
        }

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
    </div>
  )
}

export default OptionsPicker