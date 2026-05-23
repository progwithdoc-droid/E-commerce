"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Heart, Plus } from "lucide-react"
import { PRODUCTS } from "../lib/products"
import { useCart } from "../store/cart"

const filters = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"]

export function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState("All")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const addToCart = useCart((s) => s.addToCart)

  const filteredProducts =
    activeFilter === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeFilter)

  return (
    <section ref={ref} id="products" className="w-full bg-surface py-24 px-6 lg:px-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <h2 className="font-heading text-5xl lg:text-6xl text-cream tracking-wider">
          NEW ARRIVALS
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 font-body text-[11px] tracking-[0.15em] uppercase rounded-full border transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-electric text-void border-electric"
                  : "bg-transparent text-cream/50 border-cream/20 hover:border-cream/40"
              }`}
              data-cursor="hover"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative bg-void"
            data-cursor="hover"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />

              {/* Wishlist */}
              <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cream/60 hover:text-cream">
                <Heart size={18} strokeWidth={1.2} />
              </button>

              {/* Quick Add */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250">
                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className="w-full h-11 bg-black/80 backdrop-blur-sm flex items-center justify-center gap-2 font-body text-[12px] tracking-[0.2em] uppercase text-cream hover:bg-black/90 transition-colors"
                >
                  <Plus size={14} />
                  QUICK ADD
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-body text-sm text-cream leading-[1.4] mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="font-body text-sm text-cream/30 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span
                  className={`font-body text-sm ${
                    product.originalPrice ? "text-electric" : "text-cream"
                  }`}
                >
                  ${product.price}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}