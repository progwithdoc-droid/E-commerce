import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/checkout')

  return (
    <main className="min-h-screen bg-void text-cream pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-lg mx-auto text-center space-y-4">
        <h1 className="font-display text-4xl">Checkout</h1>
        <p className="text-cream/60 font-body text-sm">
          Stripe checkout will be added in the next step. Signed in as {session.user.email}.
        </p>
      </div>
    </main>
  )
}
