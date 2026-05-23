'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { useCart } from '@/app/store/cart'
import { toggleWishlist } from '@/app/actions/account'

type WishlistItem = {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: { toString(): string }
    images: string[]
  }
}

export function WishlistGrid({ items }: { items: WishlistItem[] }) {
  const router = useRouter()
  const addToCart = useCart((s) => s.addToCart)

  if (items.length === 0) {
    return (
      <div className="border border-cream/10 rounded-xl p-12 text-center bg-surface/30">
        <p className="text-cream/50 font-body text-sm mb-4">Your wishlist is empty.</p>
        <Link href="/products" className="text-electric text-sm uppercase tracking-widest">
          Browse shop
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => {
        const p = item.product
        const price = Number(p.price)
        const image = p.images[0] ?? ''
        return (
          <div
            key={item.id}
            className="border border-cream/10 rounded-xl overflow-hidden bg-surface/30 group"
          >
            <Link href={`/products/${p.slug}`} className="block relative aspect-[4/5]">
              <Image src={image} alt={p.name} fill className="object-cover" sizes="50vw" />
            </Link>
            <div className="p-4 flex flex-col gap-3">
              <Link href={`/products/${p.slug}`} className="font-body text-cream text-sm">
                {p.name}
              </Link>
              <p className="text-cream/60 text-sm">${price}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart({ id: p.id, name: p.name, price, image })
                    toast.success('Added to cart')
                  }}
                  className="flex-1 py-2 bg-electric text-void rounded-full text-[10px] uppercase tracking-wider font-body"
                >
                  Move to cart
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await toggleWishlist(p.id)
                    router.refresh()
                    toast.success('Removed from wishlist')
                  }}
                  className="px-3 py-2 border border-cream/20 rounded-full text-[10px] uppercase tracking-wider text-cream/50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
