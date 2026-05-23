'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCart } from '@/app/store/cart'
import { createCheckoutSession } from '@/app/actions/checkout'

export function CheckoutForm() {
  const items = useCart((s) => s.items)
  const subtotal = useCart((s) => s.subtotal())
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    const form = new FormData(e.currentTarget)

    const result = await createCheckoutSession({
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      name: String(form.get('name')),
      street: String(form.get('street')),
      city: String(form.get('city')),
      state: String(form.get('state')),
      zip: String(form.get('zip')),
      country: String(form.get('country') || 'US'),
    })

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    if (result.url) {
      toast.success('Redirecting to secure payment...')
      window.location.href = result.url
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 border border-cream/10 rounded-xl">
        <p className="text-cream/60 font-body">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6 border border-cream/10 rounded-xl p-6 bg-surface/30">
        <h2 className="font-display text-2xl text-cream">Shipping</h2>
        <input name="name" placeholder="Full name" required className="input-field" />
        <input name="street" placeholder="Street address" required className="input-field" />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" placeholder="City" required className="input-field" />
          <input name="state" placeholder="State" required className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="zip" placeholder="ZIP" required className="input-field" />
          <input name="country" placeholder="Country" defaultValue="US" className="input-field" />
        </div>
      </div>

      <div className="border border-cream/10 rounded-xl p-6 bg-surface/30 h-fit">
        <h2 className="font-display text-2xl text-cream mb-6">Order summary</h2>
        <ul className="space-y-4 mb-6">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative w-14 h-16 bg-void shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 text-sm font-body">
                <p className="text-cream">{item.name}</p>
                <p className="text-cream/50">Qty {item.quantity}</p>
              </div>
              <p className="text-cream text-sm">${item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-cream/10 pt-4 mb-6">
          <span className="text-cream/60 font-body">Subtotal</span>
          <span className="text-cream font-body text-lg">${subtotal.toFixed(2)}</span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-electric text-void rounded-full text-[11px] font-body tracking-[0.18em] uppercase font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </div>
    </form>
  )
}
