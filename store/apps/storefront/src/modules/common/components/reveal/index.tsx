"use client"

import { clx } from "@modules/common/components/ui"
import { ReactNode, useEffect, useRef, useState } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={clx("reveal", visible && "is-visible", className)}
    >
      {children}
    </div>
  )
}

export default Reveal
