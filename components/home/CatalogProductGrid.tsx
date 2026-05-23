'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { ProductCard } from '@/app/actions/products'
import { useCart } from '@/app/store/cart'

export function CatalogProductGrid({ products }: { products: ProductCard[] }) {
  const addToCart = useCart((s) => s.addToCart)

  if (products.length === 0) {
    return (
      <div className="text-center py-24 border border-cream/10 rounded-lg">
        <p className="text-cream/60 font-body">No products match your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
      {products.map((product) => (
        <article key={product.id} className="group relative bg-surface overflow-hidden">
          <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4]">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="33vw" />
          </Link>
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-widest text-cream/40">{product.category}</p>
            <div className="flex justify-between items-center mt-1">
              <Link href={`/products/${product.slug}`} className="text-sm text-cream font-body">
                {product.name}
              </Link>
              <span className="text-sm text-cream">${product.price}</span>
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
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-electric text-void flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus size={14} />
          </button>
        </article>
      ))}
    </div>
  )
}
