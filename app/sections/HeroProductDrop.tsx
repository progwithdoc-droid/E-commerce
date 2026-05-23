"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { IMAGES } from "../lib/images"
import { useCart } from "../store/cart"

const sizes = ["XS", "S", "M", "L", "XL"]

export function HeroProductDrop() {
  const [selectedSize, setSelectedSize] = useState("M")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const addToCart = useCart((s) => s.addToCart)

  const handleAddToCart = () => {
    addToCart({
      id: "obsidian-jacket",
      name: "The Obsidian Jacket",
      price: 620,
      image: IMAGES[13],
      size: selectedSize,
    })
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section ref={ref} className="w-full bg-void">
      <div className="flex flex-col lg:flex-row min-h-[80vh]">
        {/* Left: Image */}
        <div className="relative w-full lg:w-[60%] min-h-[50vh] lg:min-h-[80vh]">
          <Image
            src={IMAGES[13]}
            alt="The Obsidian Jacket"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(255,240,200,0.07)]" />
          {/* Letterbox bars */}
          <div className="absolute top-0 left-0 right-0 h-[4%] bg-void" />
          <div className="absolute bottom-0 left-0 right-0 h-[4%] bg-void" />
        </div>

        {/* Right: Panel */}
        <div className="w-full lg:w-[40%] bg-void flex items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="px-8 lg:px-16 py-12 lg:py-0 w-full max-w-lg"
          >
            <motion.p
              variants={itemVariants}
              className="font-body text-[10px] tracking-[0.3em] uppercase text-electric mb-4"
            >
              DROP 001 — LIMITED
            </motion.p>

            <motion.h2
              variants={itemVariants}
              className="font-display text-[56px] lg:text-[64px] font-light text-cream leading-[1.1] mb-6"
            >
              The Obsidian Jacket
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="font-body text-[15px] text-cream/55 leading-[1.7] mb-6"
            >
              Brushed matte nylon shell. Minimal seam construction. A jacket built
              to disappear into the city.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="font-body text-[28px] text-cream mb-8"
            >
              $620
            </motion.p>

            {/* Size Selector */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-9 flex items-center justify-center font-body text-xs tracking-wider border transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-cream text-void border-cream"
                        : "bg-transparent text-cream/60 border-cream/20 hover:border-cream/40"
                    }`}
                    data-cursor="hover"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              onClick={handleAddToCart}
              className="w-full h-[50px] bg-electric text-void font-body text-[11px] tracking-[0.18em] uppercase rounded-full hover:bg-cream transition-colors duration-300 mb-6"
              data-cursor="hover"
            >
              Add to Cart
            </motion.button>

            <motion.div variants={itemVariants}>
              <div className="w-full h-px bg-cream/10 mb-4" />
              <p className="font-body text-xs tracking-[0.15em] text-cream/30">
                Free shipping on orders over $300
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}