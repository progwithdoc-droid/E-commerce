"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { IMAGES } from "../lib/images"

const categories = [
  { name: "OUTERWEAR", count: "42 pieces", image: IMAGES[4], height: 520 },
  { name: "FOOTWEAR", count: "28 pieces", image: IMAGES[8], height: 380 },
  { name: "ACCESSORIES", count: "36 pieces", image: IMAGES[9], height: 480 },
  { name: "ESSENTIALS", count: "54 pieces", image: IMAGES[5], height: 440 },
]

export function FeaturedCategories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="w-full bg-void py-24 px-6 lg:px-12">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <h2 className="font-heading text-5xl lg:text-6xl text-cream tracking-wider whitespace-nowrap">
          SHOP BY CATEGORY
        </h2>
        <div className="flex-1 h-px bg-cream/10" />
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative group overflow-hidden cursor-pointer"
            style={{ height: cat.height }}
            data-cursor="hover"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-heading text-[22px] text-cream tracking-wider mb-1">
                {cat.name}
              </h3>
              <p className="font-body text-xs tracking-[0.2em] text-cream/40 uppercase">
                {cat.count}
              </p>
            </div>

            {/* Arrow */}
            <div className="absolute bottom-6 right-6">
              <ArrowRight
                size={20}
                strokeWidth={1}
                className="text-cream/60 transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}