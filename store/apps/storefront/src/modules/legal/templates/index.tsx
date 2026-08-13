import Reveal from "@modules/common/components/reveal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type LegalSection = {
  title: string
  body: string[]
}

const LegalTemplate = ({
  kicker,
  title,
  updatedAt,
  sections,
}: {
  kicker: string
  title: string
  updatedAt: string
  sections: LegalSection[]
}) => {
  return (
    <div className="content-container py-16 small:py-24">
      <Reveal className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="kicker">{kicker}</span>
          <h1 className="font-display text-3xl uppercase leading-none text-ivoire small:text-5xl">
            {title}
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ivoire/40">
            Dernière mise à jour : {updatedAt}
          </p>
        </div>

        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="font-display text-lg uppercase text-ivoire small:text-xl">
              {section.title}
            </h2>
            {section.body.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-ivoire/60">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <LocalizedClientLink
          href="/store"
          className="link-underline mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-emeraude hover:text-ivoire"
        >
          Retour au shop →
        </LocalizedClientLink>
      </Reveal>
    </div>
  )
}

export default LegalTemplate