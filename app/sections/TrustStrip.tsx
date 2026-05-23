"use client"

export function TrustStrip() {
  const items = [
    "FREE WORLDWIDE SHIPPING",
    "PREMIUM MATERIALS",
    "MADE TO ORDER",
    "30-DAY RETURNS",
    "SUSTAINABLE PACKAGING",
    "ETHICALLY SOURCED",
  ]

  return (
    <section className="w-full bg-border h-20 overflow-hidden flex items-center">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="font-heading text-[13px] tracking-[0.2em] text-cream mx-8 flex items-center gap-8"
          >
            {item}
            <span className="text-electric">·</span>
          </span>
        ))}
      </div>
    </section>
  )
}