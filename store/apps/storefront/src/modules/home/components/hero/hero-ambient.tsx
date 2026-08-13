"use client"

import { animate } from "animejs"
import { useEffect, useRef } from "react"

/**
 * Effets d'ambiance continus du hero (animejs v4) — strictement NON-critiques.
 *
 * L'animation d'entrée est gérée en CSS pur (`.hero-enter`) : si animejs
 * échoue ou ne se charge pas, le hero reste entièrement visible. animejs ne
 * fait ici qu'ajouter un glow « respirant » au CTA après l'entrée.
 */
export default function HeroAmbient({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const root = ref.current
    if (!root) return

    const cta = root.querySelector<HTMLElement>('[data-ambient="cta"]')
    if (!cta) return

    // Démarre après l'animation d'entrée CSS (~1s).
    const timer = setTimeout(() => {
      animate(cta, {
        filter: [
          "drop-shadow(0 0 28px rgba(46,139,99,0.45))",
          "drop-shadow(0 0 60px rgba(46,139,99,0.8))",
        ],
        duration: 2200,
        ease: "inOutSine",
        direction: "alternate",
        loop: true,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return <div ref={ref} className="h-full w-full">{children}</div>
}