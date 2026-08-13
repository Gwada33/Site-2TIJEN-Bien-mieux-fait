import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterForm from "@modules/layout/components/newsletter-form"

const shopLinks = [
  { name: "Shop", href: "/store" },
  { name: "Compte", href: "/account" },
  { name: "Panier", href: "/cart" },
]

const legalLinks = [
  { name: "Mentions légales", href: "/" },
  { name: "CGV", href: "/" },
  { name: "Confidentialité", href: "/" },
]

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "TikTok", href: "https://tiktok.com" },
  { name: "YouTube", href: "https://youtube.com" },
]

export default async function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-ivoire/10 bg-noir">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-12 py-16 small:flex-row small:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <LocalizedClientLink
              href="/"
              className="font-display text-xl uppercase tracking-[0.2em] text-ivoire hover:text-emeraude"
            >
              2TIJEN
            </LocalizedClientLink>
            <p className="text-sm leading-relaxed text-ivoire/50">
              Marketplace streetwear underground 100% Guadeloupe / Antilles.
              Drops limités, pensés pour le monde.
            </p>
            <ul className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline font-mono text-xs uppercase tracking-[0.2em] text-ivoire/70 hover:text-ivoire"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <span className="kicker">Boutique</span>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <LocalizedClientLink
                    href={link.href}
                    className="link-underline text-sm text-ivoire/70 hover:text-ivoire"
                  >
                    {link.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <span className="kicker">Legal</span>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="link-underline text-sm text-ivoire/70 hover:text-ivoire"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex max-w-sm flex-col gap-4">
            <span className="kicker">Rejoins le crew</span>
            <p className="text-sm text-ivoire/50">
              Première sur les drops, accès en avant-première, zéro spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 border-t border-ivoire/10 py-6 small:flex-row small:items-center small:justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-ivoire/50">
            © {new Date().getFullYear()} 2TIJEN · Made in Guadeloupe / Antilles
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-ivoire/50">
            Édition limitée · Sérigraphie locale · Drops rares
          </p>
        </div>
      </div>
    </footer>
  )
}
