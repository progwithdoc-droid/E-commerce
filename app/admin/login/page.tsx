import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminLoginForm } from '@/app/components/auth/AdminLoginForm'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const session = await auth()
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  const oauth = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID),
    github: Boolean(process.env.GITHUB_CLIENT_ID),
  }

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center px-6 py-24 cursor-auto">
      <Link
        href="/"
        className="absolute top-8 left-8 text-[11px] font-body tracking-[0.18em] uppercase text-cream/50 hover:text-cream"
      >
        ← Store
      </Link>
      <Suspense fallback={<p className="text-cream/50 text-sm">Loading...</p>}>
        <AdminLoginForm oauth={oauth} />
      </Suspense>
    </main>
  )
}
