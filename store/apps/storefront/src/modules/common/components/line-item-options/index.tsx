import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block w-full overflow-hidden text-ellipsis font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ivoire/60"
    >
      Taille : {variant?.title || "—"}
    </Text>
  )
}

export default LineItemOptions