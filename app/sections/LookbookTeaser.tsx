"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { IMAGES } from "../lib/images"

export function LookbookTeaser() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])

  return (
    <section
      ref={containerRef}
      id="lookbook"
      className="relative w-full h-[80vh] overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <Image
          src={IMAGES[2]}
          alt="Lookbook SS25"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-[10px] tracking-[0.3em] uppercase text-electric mb-6"
        >
          LOOKBOOK SS25
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[48px] sm:text-[72px] font-light text-cream leading-[1.0] mb-6 max-w-3xl"
        >
          Where Form Meets{" "}
          <em className="italic">Function</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-[15px] text-cream/50 mb-10 max-w-md"
        >
          Explore the full collection across 36 editorial frames.
        </motion.p>

        <motion.a
          href="#"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center w-[220px] h-[52px] border border-cream/40 rounded-full font-body text-[11px] tracking-[0.18em] uppercase text-cream hover:bg-cream hover:text-void transition-all duration-300"
          data-cursor="hover"
        >
          Explore Lookbook
        </motion.a>
      </div>
    </section>
  )
}