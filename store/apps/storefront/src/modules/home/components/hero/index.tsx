import { heroConfig } from "@lib/config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import HeroAmbient from "./hero-ambient"

const Hero = async ({ countryCode }: { countryCode: string }) => {
  const hasVideo = Boolean(heroConfig.videoUrl)
  const hasLogo = Boolean(heroConfig.logoUrl)

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-noir">
      {/* Grain film — texture analogique très subtile */}
      <div className="hero-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Vidéo animée en fond */}
      {hasVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          src={heroConfig.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {/* Overlay lisibilité */}
      <div className="absolute inset-0 bg-noir/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-noir/40 via-transparent to-noir" />

      <HeroAmbient>
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-6 text-center">
          {/* Logo — centré, adapté à la hauteur d'écran */}
          <div className="hero-enter-logo flex items-center justify-center">
            {hasLogo ? (
              <img
                src={heroConfig.logoUrl}
                alt="2TIJEN"
                className="h-[36vh] w-auto max-w-full object-contain small:h-[42vh]"
              />
            ) : (
              <span className="font-display text-5xl uppercase leading-none tracking-[0.08em] text-ivoire small:text-7xl">
                2TIJEN
              </span>
            )}
          </div>

          {/* Tagline */}
          <p
            className="hero-enter-rise font-display text-xl uppercase leading-none tracking-[0.06em] text-ivoire small:text-3xl"
            style={{ animationDelay: "200ms" }}
          >
            Faudra trouver un bon <span className="text-emeraude">slogan</span>
          </p>

          {/* CTA → /store */}
          <div
            className="hero-enter-pop flex flex-col items-center gap-3"
            style={{ animationDelay: "400ms" }}
          >
            <LocalizedClientLink
              href="/store"
              data-ambient="cta"
              className="clip-notch group inline-flex h-12 items-center gap-3 bg-emeraude px-8 text-sm font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emeraude-fonce"
            >
              Voir le drop
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </LocalizedClientLink>
          </div>

          {/* Nav minimale — tout en bas */}
          <nav
            aria-label="Liens légaux"
            className="hero-enter-fade absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-4 py-5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ivoire/40"
            style={{ animationDelay: "600ms" }}
          >
            <LocalizedClientLink href="/mentions-legales" className="transition-colors hover:text-ivoire">
              Mentions légales
            </LocalizedClientLink>
            <span aria-hidden="true">·</span>
            <LocalizedClientLink href="/cgv" className="transition-colors hover:text-ivoire">
              CGV
            </LocalizedClientLink>
            <span aria-hidden="true">·</span>
            <LocalizedClientLink href="/confidentialite" className="transition-colors hover:text-ivoire">
              Confidentialité
            </LocalizedClientLink>
          </nav>
        </div>
      </HeroAmbient>
    </section>
  )
}

export default Hero