import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-void text-cream px-6 py-24">
      <div className="max-w-lg mx-auto space-y-8">
        <Link
          href="/"
          className="text-[11px] font-body tracking-[0.18em] uppercase text-cream/50 hover:text-cream"
        >
          ← Home
        </Link>
        <h1 className="font-display text-4xl tracking-wide">Admin</h1>
        <p className="font-body text-sm text-cream/60">
          Signed in as {session.user.email} ({session.user.role})
        </p>
      </div>
    </main>
  )
}
