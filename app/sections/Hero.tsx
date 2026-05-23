"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { IMAGES } from "../lib/images"

export function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-void"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ clipPath: "polygon(0 0, 55% 0, 45% 100%, 0 100%)" }}
        >
          <Image
            src={IMAGES[0]}
            alt="Editorial campaign"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        </div>

        <div
          className="absolute inset-0 bg-void"
          style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}
        >
          <div className="absolute inset-0 opacity-20">
            <Image
              src={IMAGES[3]}
              alt="Product silhouette"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-void via-void/80 to-transparent" />
        </div>
      </motion.div>

      {/* AURUM — layered wordmark for strong visibility on both panels */}
      <motion.div
        style={{ y: textY, opacity }}
        className="absolute inset-0 z-[1] pointer-events-none select-none"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
          {/* Soft glow behind */}
          <span
            className="absolute inset-0 font-heading text-[clamp(4rem,22vw,18rem)] leading-[0.85] tracking-[0.04em] text-cream/[0.04] blur-2xl"
            style={{ transform: "translateY(4px)" }}
          >
            AURUM
          </span>
          {/* Deep shadow */}
          <span className="block font-heading text-[clamp(4rem,22vw,18rem)] leading-[0.85] tracking-[0.04em] text-black/50 translate-y-1">
            AURUM
          </span>
          {/* Main stroke — high contrast */}
          <span
            className="absolute inset-0 flex items-center justify-center font-heading text-[clamp(4rem,22vw,18rem)] leading-[0.85] tracking-[0.04em]"
            style={{
              WebkitTextStroke: "2px rgba(245, 240, 232, 0.55)",
              color: "transparent",
              textShadow: "0 0 80px rgba(200, 255, 0, 0.12)",
            }}
          >
            AURUM
          </span>
          {/* Electric accent on right half via clip */}
          <span
            className="absolute inset-0 flex items-center justify-center font-heading text-[clamp(4rem,22vw,18rem)] leading-[0.85] tracking-[0.04em] text-transparent"
            style={{
              WebkitTextStroke: "2px rgba(200, 255, 0, 0.45)",
              clipPath: "polygon(52% 0, 100% 0, 100% 100%, 42% 100%)",
            }}
          >
            AURUM
          </span>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-body text-[11px] tracking-[0.4em] uppercase text-cream/80 mb-3">
            NEW COLLECTION
          </p>
          <h2 className="font-heading text-[72px] lg:text-[96px] leading-[0.9] text-cream mb-4">
            SS 25
          </h2>
          <p className="font-display italic text-lg text-cream/60 mb-10">
            The Art of Restraint
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="px-8 py-3 bg-cream text-void font-body text-[11px] tracking-[0.18em] uppercase rounded-full hover:bg-electric hover:text-void border border-cream transition-all duration-300"
              data-cursor="hover"
            >
              Shop Now
            </Link>
            <Link
              href="#lookbook"
              className="px-8 py-3 bg-transparent text-cream font-body text-[11px] tracking-[0.18em] uppercase rounded-full border border-cream/40 hover:border-electric hover:text-electric transition-all duration-300"
              data-cursor="hover"
            >
              View Lookbook
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <div className="w-px h-12 bg-cream/20 overflow-hidden">
          <div className="w-full h-full bg-cream animate-scroll-line" />
        </div>
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/40">
          scroll
        </span>
      </motion.div>
    </section>
  )
}
