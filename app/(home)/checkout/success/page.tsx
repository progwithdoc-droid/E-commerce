import { Suspense } from 'react'
import CheckoutSuccessClient from './CheckoutSuccessClient'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-void pt-32" />}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
