'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { suspendCustomer, unsuspendCustomer } from '@/app/actions/admin'
import { OrderStatusBadge } from '@/components/admin/order-status'
import { EmailComposeModal } from '@/components/admin/EmailComposeModal'
import { useState } from 'react'

type Customer = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  totalSpent: number
  orders: {
    id: string
    orderNumber: string
    status: string
    total: { toString(): string }
    createdAt: Date
  }[]
}

export function CustomerDetailPanel({ customer }: { customer: Customer }) {
  const [pending, startTransition] = useTransition()
  const [emailOpen, setEmailOpen] = useState(false)

  function toggleSuspend() {
    startTransition(async () => {
      const res =
        customer.role === 'SUSPENDED'
          ? await unsuspendCustomer(customer.id)
          : await suspendCustomer(customer.id)
      toast.success(customer.role === 'SUSPENDED' ? 'Customer restored' : 'Customer suspended')
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-electric">Customer</p>
          <h1 className="font-display text-3xl text-cream">{customer.name ?? 'Guest'}</h1>
          <p className="text-sm text-cream/50">{customer.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEmailOpen(true)}
            className="px-4 py-2 border border-cream/20 rounded-lg text-[10px] uppercase tracking-widest hover:border-electric hover:text-electric"
          >
            Send email
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={toggleSuspend}
            className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-[10px] uppercase tracking-widest hover:bg-red-500/10"
          >
            {customer.role === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border border-cream/10 rounded-xl p-4 bg-surface/40">
          <p className="text-[10px] uppercase tracking-widest text-cream/45">Orders</p>
          <p className="font-display text-2xl text-cream mt-1">{customer.orders.length}</p>
        </div>
        <div className="border border-cream/10 rounded-xl p-4 bg-surface/40">
          <p className="text-[10px] uppercase tracking-widest text-cream/45">Total spent</p>
          <p className="font-display text-2xl text-electric mt-1">
            ${customer.totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="border border-cream/10 rounded-xl p-4 bg-surface/40">
          <p className="text-[10px] uppercase tracking-widest text-cream/45">Member since</p>
          <p className="font-body text-cream mt-2 text-sm">
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-cream mb-4">Order history</h2>
        <div className="border border-cream/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-cream/10 text-cream/50 text-[10px] uppercase tracking-widest">
                <th className="p-4 text-left">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((o) => (
                <tr key={o.id} className="border-b border-cream/5 hover:bg-cream/5">
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-mono text-cream hover:text-electric"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="p-4 text-right text-cream">${Number(o.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {customer.orders.length === 0 && (
            <p className="p-6 text-center text-cream/40 text-sm">No orders yet.</p>
          )}
        </div>
      </div>

      <EmailComposeModal
        customer={emailOpen ? { id: customer.id, name: customer.name, email: customer.email } : null}
        onClose={() => setEmailOpen(false)}
      />
    </div>
  )
}
