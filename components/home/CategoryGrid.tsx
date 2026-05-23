'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 px-6 lg:px-12 border-b border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/products?category=${cat.slug}`}
              className="block p-6 border border-cream/10 rounded-lg hover:border-cream/30 transition-colors text-center"
            >
              <span className="font-body text-[11px] tracking-[0.2em] uppercase text-cream">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
