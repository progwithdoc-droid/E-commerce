import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OrderDetailPanel } from '@/components/admin/OrderDetailPanel'
import { getOrderById } from '@/app/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrderById(params.id)
  if (!order) notFound()

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-cream/50 hover:text-cream">
        ← Orders
      </Link>
      <OrderDetailPanel order={order} />
    </div>
  )
}
