'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { OrderStatusBadge, ORDER_STATUSES } from '@/components/admin/order-status'

type Order = {
  id: string
  orderNumber: string
  status: string
  total: { toString(): string }
  createdAt: Date
  user: { name: string | null; email: string } | null
  items: { quantity: number }[]
}

const columnHelper = createColumnHelper<Order>()

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [status, setStatus] = useState('ALL')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status !== 'ALL' && o.status !== status) return false
      if (from && new Date(o.createdAt) < new Date(from)) return false
      if (to) {
        const end = new Date(to)
        end.setHours(23, 59, 59, 999)
        if (new Date(o.createdAt) > end) return false
      }
      if (search) {
        const q = search.toLowerCase()
        const match =
          o.orderNumber.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [orders, status, from, to, search])

  const columns = useMemo(
    () => [
      columnHelper.accessor('orderNumber', {
        header: 'Order',
        cell: (info) => (
          <Link
            href={`/admin/orders/${info.row.original.id}`}
            className="font-mono text-cream hover:text-electric"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor((r) => r.user?.name ?? 'Guest', { id: 'customer', header: 'Customer' }),
      columnHelper.accessor((r) => r.items.reduce((s, i) => s + i.quantity, 0), {
        id: 'items',
        header: 'Items',
      }),
      columnHelper.accessor((r) => `$${Number(r.total).toFixed(2)}`, {
        id: 'total',
        header: 'Total',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <OrderStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor((r) => new Date(r.createdAt).toLocaleDateString(), {
        id: 'date',
        header: 'Date',
      }),
    ],
    []
  )

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders…"
          className="input-field max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field w-auto text-xs"
        >
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input-field w-auto text-xs" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input-field w-auto text-xs" />
      </div>

      <div className="border border-cream/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body min-w-[640px]">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-cream/10 text-cream/50 text-[10px] uppercase tracking-widest">
                {hg.headers.map((h) => (
                  <th key={h.id} className="p-4 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-cream/5 hover:bg-cream/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-cream/40 text-sm">No orders found.</p>
        )}
      </div>
    </div>
  )
}
