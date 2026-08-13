import { Anton, Space_Grotesk, Space_Mono } from "next/font/google"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "2TIJEN — Streetwear underground des Antilles",
  description:
    "Marketplace streetwear underground 100% Guadeloupe / Antilles. Drops limités, sérigraphie locale, créateurs locaux.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`dark ${anton.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
