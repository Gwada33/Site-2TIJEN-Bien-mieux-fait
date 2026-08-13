"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

/**
 * Parallaxe + fondu du hero du store (GSAP ScrollTrigger).
 *
 * Au scroll :
 * - l'image glisse doucement vers le haut (parallaxe, scrub) pendant que la
 *   section produits la recouvre ;
 * - le contenu (titre, badge, indication scroll) fond et monte.
 *
 * Strictement non-critique : si GSAP ne charge pas ou si
 * `prefers-reduced-motion`, tout reste visible et statique.
 */
export default function StoreHeroParallax({
  children,
}: {
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const image = root.querySelector<HTMLElement>(
      '[data-hero-parallax="image"]'
    )
    const content = root.querySelectorAll<HTMLElement>(
      '[data-hero-parallax="content"]'
    )

    if (!image && content.length === 0) return

    const ctx = gsap.context(() => {
      if (image) {
        gsap.to(image, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      }

      if (content.length > 0) {
        gsap.to(content, {
          opacity: 0,
          y: -36,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      }
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={ref} className="absolute inset-0">
      {children}
    </div>
  )
}