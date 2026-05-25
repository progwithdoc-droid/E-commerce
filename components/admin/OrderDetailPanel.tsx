'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { OrderStatusBadge, ORDER_STATUSES } from '@/components/admin/order-status'
import { updateOrderStatus, issueRefund } from '@/app/actions/admin'

type Order = {
  id: string
  orderNumber: string
  status: string
  total: { toString(): string }
  createdAt: Date
  stripePaymentId: string | null
  shippingAddress: unknown
  user: { name: string | null; email: string } | null
  items: {
    quantity: number
    size: string | null
    price: { toString(): string }
    product: { name: string; images: string[] }
  }[]
}

export function OrderDetailPanel({ order }: { order: Order }) {
  const [pending, startTransition] = useTransition()
  const address = order.shippingAddress as Record<string, string> | null

  function setStatus(status: string) {
    startTransition(async () => {
      const res = await updateOrderStatus(order.id, status)
      if (res.error) toast.error(res.error)
      else toast.success('Status updated')
    })
  }

  function refund() {
    if (!confirm('Refund and cancel this order?')) return
    startTransition(async () => {
      const res = await issueRefund(order.id)
      if (res.error) toast.error(res.error)
      else toast.success('Refund processed')
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-electric">Order</p>
          <h1 className="font-display text-3xl text-cream font-mono">{order.orderNumber}</h1>
          <p className="text-sm text-cream/50 mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-cream/10 rounded-xl p-5 bg-surface/40">
          <p className="text-[10px] uppercase tracking-widest text-cream/45 mb-3">Customer</p>
          <p className="text-cream">{order.user?.name ?? 'Guest'}</p>
          <p className="text-sm text-cream/50">{order.user?.email}</p>
        </div>
        {address && (
          <div className="border border-cream/10 rounded-xl p-5 bg-surface/40">
            <p className="text-[10px] uppercase tracking-widest text-cream/45 mb-3">Shipping</p>
            <p className="text-sm text-cream/70 font-body leading-relaxed">
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

      <div className="border border-cream/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-cream/10 text-cream/50 text-[10px] uppercase tracking-widest">
              <th className="p-4 text-left">Item</th>
              <th className="p-4">Qty</th>
              <th className="p-4 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-cream/5">
                <td className="p-4 text-cream">
                  {item.product.name}
                  {item.size && (
                    <span className="text-cream/40 text-xs ml-2">Size {item.size}</span>
                  )}
                </td>
                <td className="p-4 text-center text-cream/70">{item.quantity}</td>
                <td className="p-4 text-right text-cream">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="p-4 text-right text-cream/50 uppercase text-[10px] tracking-widest">
                Total
              </td>
              <td className="p-4 text-right font-display text-xl text-electric">
                ${Number(order.total).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          disabled={pending}
          value={order.status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field w-auto"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={pending}
          onClick={refund}
          className="px-4 py-2.5 border border-red-500/40 text-red-400 rounded-lg text-[10px] uppercase tracking-widest hover:bg-red-500/10"
        >
          Issue refund
        </button>
      </div>
    </div>
  )
}
