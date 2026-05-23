"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { IMAGES } from "../lib/images"

export function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-void"
    >
      {/* Background Image with diagonal clip */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 0, 55% 0, 45% 100%, 0 100%)",
          }}
        >
          <Image
            src={IMAGES[0]}
            alt="Editorial campaign"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Right panel with ghost image */}
        <div
          className="absolute inset-0 bg-void"
          style={{
            clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-15">
            <Image
              src={IMAGES[3]}
              alt="Product silhouette"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* Massive outlined AURUM text behind */}
      <motion.div
        style={{ y: textY, opacity }}
        className="absolute inset-0 flex items-center justify-start z-0 pointer-events-none"
      >
        <h1
          className="font-display font-thin text-[22vw] leading-none tracking-tighter whitespace-nowrap"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.15)",
            color: "transparent",
            marginLeft: "-5vw",
          }}
        >
          AURUM
        </h1>
      </motion.div>

      {/* Content */}
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

          <div className="flex items-center gap-4">
            <a
              href="#products"
              className="px-8 py-3 bg-cream text-void font-body text-[11px] tracking-[0.18em] uppercase rounded-full hover:bg-void hover:text-cream border border-cream transition-all duration-300"
              data-cursor="hover"
            >
              Shop Now
            </a>
            <a
              href="#lookbook"
              className="px-8 py-3 bg-transparent text-cream font-body text-[11px] tracking-[0.18em] uppercase rounded-full border border-cream/40 hover:bg-cream hover:text-void transition-all duration-300"
              data-cursor="hover"
            >
              View Lookbook
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
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