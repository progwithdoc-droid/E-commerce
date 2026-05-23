import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/app/components/auth/LoginForm'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) {
    redirect('/account')
  }

  const oauth = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID),
    github: Boolean(process.env.GITHUB_CLIENT_ID),
  }

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center px-6 py-24">
      <Link
        href="/"
        className="absolute top-8 left-8 text-[11px] font-body tracking-[0.18em] uppercase text-cream/50 hover:text-cream"
      >
        ← Back
      </Link>
      <Suspense fallback={<p className="text-cream/50 text-sm">Loading...</p>}>
        <LoginForm oauth={oauth} />
      </Suspense>
    </main>
  )
}
