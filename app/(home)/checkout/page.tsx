import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { CheckoutForm } from '@/components/home/CheckoutForm'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/checkout')

  return (
    <div className="min-h-screen bg-void text-cream pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-electric mb-2">Secure checkout</p>
        <h1 className="font-display text-4xl text-cream mb-10">Checkout</h1>
        <Suspense fallback={<p className="text-cream/50">Loading...</p>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  )
}
