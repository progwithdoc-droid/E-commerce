import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function OrdersPage() {
  const session = await auth()
  const orders = await prisma.order.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  })

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl text-cream">Orders</h2>
      {orders.length === 0 ? (
        <div className="border border-cream/10 rounded-xl p-10 text-center bg-surface/30">
          <p className="text-cream/50 font-body text-sm">No orders yet.</p>
          <Link href="/products" className="inline-block mt-4 text-electric text-xs uppercase tracking-widest">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="border border-cream/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-cream/10 text-left text-cream/50 text-[10px] uppercase tracking-widest">
                <th className="p-4">Order</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-cream/5 hover:bg-cream/5">
                  <td className="p-4">
                    <Link href={`/account/orders/${order.id}`} className="text-cream font-mono hover:text-electric">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4 text-cream/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-cream/20 text-cream/70">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-cream">${Number(order.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
