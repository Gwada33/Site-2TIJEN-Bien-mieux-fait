import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <section
      aria-labelledby="help-heading"
      className="mt-2 flex flex-col gap-3"
    >
      <Heading
        level="h2"
        id="help-heading"
        className="flex items-center gap-3 text-xl text-ivoire"
      >
        <span className="h-px w-6 bg-emeraude" aria-hidden="true" />
        Besoin d'aide ?
      </Heading>
      <ul className="flex flex-col gap-2">
        <li>
          <LocalizedClientLink
            href="/contact"
            className="link-underline text-sm text-ivoire/80 transition-colors hover:text-emeraude"
          >
            Contact
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/contact"
            className="link-underline text-sm text-ivoire/80 transition-colors hover:text-emeraude"
          >
            Retours &amp; échanges
          </LocalizedClientLink>
        </li>
      </ul>
    </section>
  )
}

export default Help
