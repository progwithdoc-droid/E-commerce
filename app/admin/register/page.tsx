import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminRegisterForm } from '@/app/components/auth/AdminRegisterForm'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminRegisterPage() {
  const session = await auth()
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center px-6 py-24 cursor-auto">
      <Link
        href="/"
        className="absolute top-8 left-8 text-[11px] font-body tracking-[0.18em] uppercase text-cream/50 hover:text-cream"
      >
        ← Store
      </Link>
      <AdminRegisterForm />
    </main>
  )
}
