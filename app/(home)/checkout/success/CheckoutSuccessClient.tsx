'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useCart } from '@/app/store/cart'

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const clearCart = useCart((s) => s.clearCart)

  useEffect(() => {
    clearCart()
    toast.success('Order confirmed — thank you!')
  }, [clearCart])

  return (
    <main className="min-h-screen bg-void text-cream pt-32 pb-24 px-6 flex flex-col items-center text-center">
      <p className="text-electric text-[11px] tracking-[0.3em] uppercase mb-4">Success</p>
      <h1 className="font-display text-5xl mb-4">Thank you</h1>
      {orderNumber && (
        <p className="text-cream/60 font-body text-sm mb-8">
          Order <span className="text-cream font-mono">{orderNumber}</span> is confirmed.
        </p>
      )}
      <Link
        href="/products"
        className="px-8 py-3 bg-cream text-void rounded-full text-[11px] tracking-[0.18em] uppercase font-body"
      >
        Continue shopping
      </Link>
    </main>
  )
}
