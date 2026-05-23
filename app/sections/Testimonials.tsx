"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star } from "lucide-react"

const reviews = [
  {
    stars: 5,
    quote:
      "The quality is unlike anything I've owned. The fabric has this weight to it that feels intentional, almost architectural. Worth every dollar.",
    name: "Marcus Chen",
    location: "Tokyo, Japan",
  },
  {
    stars: 5,
    quote:
      "I've been searching for a brand that understands restraint without being boring. AURUM nails it. The Obsidian Jacket is my new uniform.",
    name: "Sofia Laurent",
    location: "Paris, France",
  },
  {
    stars: 5,
    quote:
      "The packaging alone told me this was different. Unboxing felt like opening a gallery piece. The garment exceeded even that expectation.",
    name: "James Wright",
    location: "New York, USA",
  },
  {
    stars: 5,
    quote:
      "Minimal, precise, and quietly luxurious. Every seam is considered. This is what modern luxury should feel like.",
    name: "Yuki Tanaka",
    location: "Osaka, Japan",
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="w-full bg-[#0A0A0A] py-24 px-6 lg:px-12">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-heading text-5xl lg:text-6xl text-cream tracking-wider text-center mb-16"
      >
        WORN & LOVED
      </motion.h2>

      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex gap-6 w-max">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-[320px] flex-shrink-0 p-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    fill="#C8FF00"
                    stroke="#C8FF00"
                    strokeWidth={0}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-display italic text-base text-cream/75 leading-[1.7] mb-6">
                "{review.quote}"
              </p>

              {/* Author */}
              <div>
                <p className="font-body text-xs tracking-[0.15em] text-cream/60 uppercase">
                  {review.name}
                </p>
                <p className="font-body text-xs text-cream/30 mt-1">
                  {review.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}