import { Metadata } from "next"

import Hero from "@modules/home/components/hero"

export const metadata: Metadata = {
  title: "2TIJEN — Streetwear underground des Antilles",
  description:
    "Marketplace streetwear underground 100% Guadeloupe / Antilles. Drops limités, sérigraphie locale, fabriqué localement.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  return <Hero countryCode={countryCode} />
}