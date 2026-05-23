'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { ProductCard } from '@/app/actions/products'
import { useCart } from '@/app/store/cart'

export function FeaturedProducts({ products }: { products: ProductCard[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const addToCart = useCart((s) => s.addToCart)

  return (
    <section ref={ref} id="products" className="w-full bg-surface py-24 px-6 lg:px-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <h2 className="font-heading text-5xl lg:text-6xl text-cream tracking-wider">
          NEW ARRIVALS
        </h2>
        <Link
          href="/products"
          className="font-body text-[11px] tracking-[0.18em] uppercase text-cream/70 hover:text-cream border border-cream/20 rounded-full px-4 py-2"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
        {products.map((product, i) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="group relative bg-void overflow-hidden"
          >
            <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </Link>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void/90 to-transparent">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/50 mb-1">
                {product.category}
              </p>
              <div className="flex items-end justify-between gap-2">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-body text-sm text-cream hover:underline">{product.name}</h3>
                </Link>
                <span className="font-body text-sm text-cream">${product.price}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-electric text-void flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Add to cart"
            >
              <Plus size={16} />
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
