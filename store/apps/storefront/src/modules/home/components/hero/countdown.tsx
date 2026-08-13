"use client"

import { useEffect, useState } from "react"

type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const getParts = (target: number): TimeParts => {
  const diff = Math.max(0, target - Date.now())

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  }
}

const pad = (value: number) => String(value).padStart(2, "0")

const DropCountdown = ({ nextDropAt }: { nextDropAt: string | null }) => {
  const [parts, setParts] = useState<TimeParts | null>(null)

  useEffect(() => {
    if (!nextDropAt) {
      return
    }

    const target = new Date(nextDropAt).getTime()

    // Première mise à jour immédiate (après hydratation pour éviter tout
    // décalage serveur/client), puis tick toutes les secondes.
    setParts(getParts(target))

    const interval = setInterval(() => setParts(getParts(target)), 1000)

    return () => clearInterval(interval)
  }, [nextDropAt])

  if (!nextDropAt) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="kicker">{"// Prochain drop"}</span>
        <p className="max-w-xs text-sm leading-relaxed text-ivoire/60">
          Date à annoncer. Rejoins le crew pour être prévenu en premier.
        </p>
      </div>
    )
  }

  const units = parts
    ? [
        { key: "days", value: parts.days, label: "Jours" },
        { key: "hours", value: parts.hours, label: "Heures" },
        { key: "minutes", value: parts.minutes, label: "Min" },
        { key: "seconds", value: parts.seconds, label: "Sec" },
      ]
    : null

  return (
    <div className="flex flex-col items-center gap-6">
      <span className="kicker">{"// Prochain drop dans"}</span>

      <div className="grid grid-cols-4 gap-2.5 small:gap-4">
        {units?.map((unit) => (
          <div
            key={unit.key}
            className="flex w-[4.25rem] flex-col items-center gap-2 border border-ivoire/15 bg-noir/70 px-2 py-4 backdrop-blur-sm small:w-24 small:py-5"
          >
            <span
              className={
                unit.key === "seconds"
                  ? "font-mono text-4xl tabular-nums text-emeraude small:text-5xl"
                  : "font-mono text-4xl tabular-nums text-ivoire small:text-5xl"
              }
            >
              {pad(unit.value)}
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ivoire/50">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.25em] text-ivoire/40">
        Le prochain drop arrive. Sois prêt.
      </p>
    </div>
  )
}

export default DropCountdown
