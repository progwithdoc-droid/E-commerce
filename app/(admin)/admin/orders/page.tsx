import { OrdersTable } from '@/components/admin/OrdersTable'
import { getAllOrders } from '@/app/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-electric mb-1">Fulfillment</p>
        <h1 className="font-display text-4xl text-cream">Orders</h1>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
