import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="min-h-screen bg-void text-cream pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-electric mb-2">Aurum</p>
          <h1 className="font-display text-4xl lg:text-5xl text-cream">My account</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
          <AccountSidebar
            userName={session.user.name}
            userEmail={session.user.email}
          />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
