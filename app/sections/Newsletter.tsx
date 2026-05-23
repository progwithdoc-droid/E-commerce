"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [focused, setFocused] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <section
      ref={ref}
      className="w-full bg-border py-24 px-6 lg:px-12 relative overflow-hidden"
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[56px] text-cream tracking-wider mb-6"
        >
          EARLY ACCESS & DROPS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-base text-cream/50 mb-10 max-w-[480px] mx-auto"
        >
          Join 40,000+ members. First access to new drops, exclusive offers, and
          behind-the-scenes content.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="flex items-center gap-0 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="your@email.com"
            className="flex-1 h-12 bg-transparent border-b font-body text-sm text-cream placeholder:text-cream/25 outline-none transition-colors duration-300"
            style={{
              borderColor: focused ? "#C8FF00" : "rgba(255,255,255,0.3)",
            }}
          />
          <button
            type="submit"
            className="h-12 px-8 bg-electric text-void font-body text-[11px] tracking-[0.18em] uppercase hover:bg-cream transition-colors duration-300"
            data-cursor="hover"
          >
            JOIN NOW
          </button>
        </motion.form>
      </div>
    </section>
  )
}