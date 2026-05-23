'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProductCard } from '@/app/actions/products'
import { useCart } from '@/app/store/cart'

type ProductDetailProps = {
  product: ProductCard & {
    description: string | null
    images: string[]
    stock: number
    sku: string | null
    related: ProductCard[]
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [qty, setQty] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)
  const addToCart = useCart((s) => s.addToCart)
  const images = product.images.length > 0 ? product.images : [product.image]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] bg-surface overflow-hidden">
          <Image
            src={images[imageIndex]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={`w-12 h-12 relative border ${i === imageIndex ? 'border-electric' : 'border-cream/20'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-cream/50 mb-2">
            {product.category}
          </p>
          <h1 className="font-heading text-4xl lg:text-5xl text-cream tracking-wide mb-4">
            {product.name}
          </h1>
          <p className="font-body text-2xl text-cream mb-6">${product.price}</p>
          {product.description && (
            <p className="text-cream/60 font-body text-sm leading-relaxed mb-8">
              {product.description}
            </p>
          )}
          <p className="text-xs text-cream/40 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <label className="text-[11px] uppercase tracking-widest text-cream/50">Qty</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-16 bg-transparent border border-cream/20 rounded px-2 py-1 text-cream text-sm"
            />
          </div>

          <button
            type="button"
            disabled={product.stock < 1}
            onClick={() => {
              for (let i = 0; i < qty; i++) {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
            }}
            className="w-full py-4 bg-electric text-void rounded-full text-[11px] font-body tracking-[0.2em] uppercase font-semibold disabled:opacity-40"
          >
            Add to cart
          </button>
        </div>
      </div>

      {product.related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-heading text-3xl text-cream mb-8">Related</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {product.related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] bg-surface mb-2">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="25vw" />
                </div>
                <p className="text-sm text-cream font-body">{p.name}</p>
                <p className="text-sm text-cream/60">${p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
