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
import { Mail } from 'lucide-react'
import { EmailComposeModal } from '@/components/admin/EmailComposeModal'

type Customer = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  orderCount: number
  totalSpent: number
}

const columnHelper = createColumnHelper<Customer>()

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState('')
  const [emailCustomer, setEmailCustomer] = useState<Customer | null>(null)

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <Link
            href={`/admin/customers/${info.row.original.id}`}
            className="text-cream hover:text-electric"
          >
            {info.getValue() ?? '—'}
          </Link>
        ),
      }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('orderCount', { header: 'Orders' }),
      columnHelper.accessor((r) => `$${r.totalSpent.toFixed(2)}`, {
        id: 'spent',
        header: 'Total spent',
      }),
      columnHelper.accessor((r) => new Date(r.createdAt).toLocaleDateString(), {
        id: 'joined',
        header: 'Joined',
      }),
      columnHelper.accessor('role', {
        header: 'Status',
        cell: (info) => (
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
              info.getValue() === 'SUSPENDED'
                ? 'text-red-400 border-red-500/30'
                : 'text-cream/60 border-cream/20'
            }`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => setEmailCustomer(row.original)}
            className="p-2 text-cream/50 hover:text-electric"
            aria-label="Email customer"
          >
            <Mail size={14} />
          </button>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data: customers,
    columns,
    state: { globalFilter: search },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _id, filter) => {
      const q = String(filter).toLowerCase()
      const c = row.original
      return (
        (c.name?.toLowerCase().includes(q) ?? false) || c.email.toLowerCase().includes(q)
      )
    },
  })

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search customers…"
        className="input-field max-w-xs"
      />

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
      </div>

      <EmailComposeModal
        customer={emailCustomer}
        onClose={() => setEmailCustomer(null)}
      />
    </div>
  )
}
