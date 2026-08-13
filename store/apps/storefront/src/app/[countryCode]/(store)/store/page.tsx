import { Metadata } from "next"

import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getCurrentDrop } from "@lib/data/drop-presentation"
import { listProductOptions } from "@lib/data/products"

export const metadata: Metadata = {
  title: "Le drop — 2TIJEN",
  description:
    "Le drop en cours. Streetwear underground 100% Guadeloupe / Antilles. Éditions limitées, sérigraphie locale, expédiées depuis la Guadeloupe.",
}

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  optionValueIds?: string | string[]
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)

  const [{ drop }, productOptions] = await Promise.all([
    getCurrentDrop(params.countryCode),
    listProductOptions(),
  ])

  return (
    <StoreTemplate
      drop={drop}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
      productOptions={productOptions}
    />
  )
}