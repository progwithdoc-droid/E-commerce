import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/app/components/auth/RegisterForm'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const session = await auth()
  if (session?.user) {
    redirect('/account')
  }

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center px-6 py-24">
      <Link
        href="/"
        className="absolute top-8 left-8 text-[11px] font-body tracking-[0.18em] uppercase text-cream/50 hover:text-cream"
      >
        ← Back
      </Link>
      <RegisterForm />
    </main>
  )
}
