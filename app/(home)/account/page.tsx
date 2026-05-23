import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Package, MapPin, Heart } from 'lucide-react'

export default async function AccountOverviewPage() {
  const session = await auth()
  const userId = session!.user!.id

  const [orderCount, addressCount, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.address.count({ where: { userId } }),
    prisma.wishlist.count({ where: { userId } }),
  ])

  const recentOrders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const cards = [
    { label: 'Orders', value: orderCount, href: '/account/orders', icon: Package },
    { label: 'Addresses', value: addressCount, href: '/account/addresses', icon: MapPin },
    { label: 'Wishlist', value: wishlistCount, href: '/account/wishlist', icon: Heart },
  ]

  return (
    <div className="space-y-10">
      <section className="border border-cream/10 rounded-xl p-6 bg-gradient-to-br from-surface/80 to-void">
        <p className="text-cream/50 text-sm font-body mb-1">Signed in as</p>
        <p className="font-display text-2xl text-cream">{session?.user?.name ?? 'Member'}</p>
        <p className="text-cream/60 text-sm font-body mt-1">{session?.user?.email}</p>
      </section>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="border border-cream/10 rounded-xl p-5 bg-surface/30 hover:border-electric/40 transition-colors group"
          >
            <Icon size={20} className="text-electric mb-3 opacity-80" />
            <p className="text-3xl font-heading text-cream">{value}</p>
            <p className="text-[11px] uppercase tracking-widest text-cream/50 mt-1 group-hover:text-cream">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-cream">Recent orders</h2>
          <Link href="/account/orders" className="text-xs uppercase tracking-widest text-cream/50 hover:text-cream">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-cream/50 text-sm font-body">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex justify-between items-center border border-cream/10 rounded-lg px-4 py-3 hover:bg-cream/5 transition-colors"
                >
                  <span className="font-mono text-sm text-cream">{order.orderNumber}</span>
                  <span className="text-xs uppercase tracking-wider text-cream/50">{order.status}</span>
                  <span className="text-sm text-cream">${Number(order.total).toFixed(2)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
