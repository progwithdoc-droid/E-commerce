'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProductFormModal } from '@/components/admin/ProductFormModal'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: { toString(): string }
  comparePrice: { toString(): string } | null
  stock: number
  sku: string | null
  categoryId: string | null
  images: string[]
}

type Category = { id: string; name: string }

export function ProductEditClient({
  product,
  categories,
}: {
  product: Product
  categories: Category[]
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="text-xs uppercase tracking-widest text-cream/50 hover:text-cream">
        ← Products
      </Link>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-electric mb-1">Edit</p>
        <h1 className="font-display text-4xl text-cream">{product.name}</h1>
        <p className="text-sm text-cream/50 font-mono mt-1">{product.slug}</p>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-cream/20 rounded-lg text-[10px] uppercase tracking-widest hover:border-electric"
      >
        Edit product
      </button>
      <ProductFormModal
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        product={product}
      />
    </div>
  )
}
