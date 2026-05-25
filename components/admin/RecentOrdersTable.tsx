'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { OrderStatusBadge, ORDER_STATUSES } from '@/components/admin/order-status'
import { updateOrderStatus, issueRefund } from '@/app/actions/admin'

type OrderRow = {
  id: string
  orderNumber: string
  status: string
  total: { toString(): string }
  createdAt: Date
  user: { name: string | null; email: string } | null
  items: { product: { name: string } }[]
}

export function RecentOrdersTable({ orders }: { orders: OrderRow[] }) {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sort, setSort] = useState<'date' | 'total'>('date')
  const [pending, startTransition] = useTransition()
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...orders]
    if (statusFilter !== 'ALL') list = list.filter((o) => o.status === statusFilter)
    list.sort((a, b) => {
      if (sort === 'total') return Number(b.total) - Number(a.total)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return list
  }, [orders, statusFilter, sort])

  function handleStatus(orderId: string, status: string) {
    setOpenId(null)
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status)
      if (res.error) toast.error(res.error)
      else toast.success('Status updated')
    })
  }

  function handleRefund(orderId: string) {
    setOpenId(null)
    if (!confirm('Issue refund and cancel this order?')) return
    startTransition(async () => {
      const res = await issueRefund(orderId)
      if (res.error) toast.error(res.error)
      else toast.success('Refund processed')
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto text-xs py-2"
        >
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'date' | 'total')}
          className="input-field w-auto text-xs py-2"
        >
          <option value="date">Sort by date</option>
          <option value="total">Sort by total</option>
        </select>
      </div>

      <div className="border border-cream/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body min-w-[720px]">
          <thead>
            <tr className="border-b border-cream/10 text-left text-cream/50 text-[10px] uppercase tracking-widest">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 w-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-cream/5 hover:bg-cream/5">
                <td className="p-4 font-mono text-cream">
                  <Link href={`/admin/orders/${order.id}`} className="hover:text-electric">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-4 text-cream/70">
                  {order.user?.name ?? 'Guest'}
                  <span className="block text-xs text-cream/40">{order.user?.email}</span>
                </td>
                <td className="p-4 text-cream/60 text-xs max-w-[140px] truncate">
                  {order.items.map((i) => i.product.name).join(', ')}
                </td>
                <td className="p-4 text-cream">${Number(order.total).toFixed(2)}</td>
                <td className="p-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="p-4 text-cream/50 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 relative">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setOpenId(openId === order.id ? null : order.id)}
                    className="p-2 rounded-lg hover:bg-cream/10 text-cream/60"
                    aria-label="Actions"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openId === order.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenId(null)} />
                      <div className="absolute right-4 top-12 z-20 min-w-[160px] border border-cream/15 rounded-lg bg-surface shadow-xl py-1">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="block px-4 py-2 text-xs text-cream/80 hover:bg-cream/5"
                        >
                          View
                        </Link>
                        {ORDER_STATUSES.filter((s) => s !== order.status).map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="w-full text-left px-4 py-2 text-xs text-cream/80 hover:bg-cream/5"
                            onClick={() => handleStatus(order.id, s)}
                          >
                            Mark {s}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10"
                          onClick={() => handleRefund(order.id)}
                        >
                          Refund
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-cream/40 text-sm">No orders match filters.</p>
        )}
      </div>
    </div>
  )
}
