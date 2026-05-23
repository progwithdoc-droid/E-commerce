import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

const links = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/wishlist', label: 'Wishlist' },
]

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <main className="min-h-screen bg-void text-cream pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
        <aside>
          <p className="text-[11px] tracking-[0.2em] uppercase text-cream/40 mb-4">
            Account
          </p>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body text-cream/70 hover:text-cream"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </main>
  )
}
