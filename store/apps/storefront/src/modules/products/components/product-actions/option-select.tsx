"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-2" data-testid={dataTestId}>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ivoire/50">
        {title}
      </span>
      <div className="flex flex-wrap gap-2">
        {filteredOptions.map((v) => {
          const isSelected = v === current
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors duration-150",
                {
                  "border-emeraude bg-emeraude text-white": isSelected,
                  "border-ivoire/15 text-ivoire/70 hover:border-ivoire/40 hover:text-ivoire":
                    !isSelected,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
              aria-pressed={isSelected}
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect