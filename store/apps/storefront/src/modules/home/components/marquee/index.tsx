const MarqueeItems = [
  "ÉDITION LIMITÉE",
  "SÉRIGRAPHIE LOCALE",
  "PLUS QUE QUELQUES PIÈCES",
  "ZÉRO RÉASSORT",
  "DROPS RARES",
]

const Marquee = () => {
  const group = (
    <div className="flex shrink-0 items-center">
      {MarqueeItems.map((item, index) => (
        <span
          key={item}
          className="flex items-center gap-8 px-8 font-display text-sm uppercase tracking-[0.2em] text-noir small:text-base"
        >
          {item}
          <span
            className={
              index % 2 === 0 ? "text-noir/40" : "text-emeraude"
            }
            aria-hidden="true"
          >
            *
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="overflow-hidden border-y border-noir/10 bg-or py-3">
      <div className="marquee-track">
        {group}
        {group}
      </div>
    </div>
  )
}

export default Marquee
