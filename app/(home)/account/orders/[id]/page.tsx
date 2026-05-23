import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type PageProps = { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  const order = await prisma.order.findFirst({
    where: { id, userId: session!.user!.id },
    include: {
      items: { include: { product: true } },
    },
  })

  if (!order) notFound()

  const address = order.shippingAddress as Record<string, string> | null

  return (
    <div className="space-y-8">
      <Link href="/account/orders" className="text-xs uppercase tracking-widest text-cream/50 hover:text-cream">
        ← Back to orders
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-cream font-mono">{order.orderNumber}</h2>
          <p className="text-cream/50 text-sm font-body mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-electric/30 text-electric">
          {order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-cream/10 rounded-xl p-6 bg-surface/30">
          <h3 className="text-[10px] uppercase tracking-widest text-cream/50 mb-4">Items</h3>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm font-body">
                <span className="text-cream">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="text-cream/70">${Number(item.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-cream/10 mt-4 pt-4 flex justify-between font-body text-cream">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </p>
        </div>
        {address && (
          <div className="border border-cream/10 rounded-xl p-6 bg-surface/30">
            <h3 className="text-[10px] uppercase tracking-widest text-cream/50 mb-4">Shipping</h3>
            <p className="text-sm font-body text-cream/80 leading-relaxed">
              {address.name}
              <br />
              {address.street}
              <br />
              {address.city}, {address.state} {address.zip}
              <br />
              {address.country}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
