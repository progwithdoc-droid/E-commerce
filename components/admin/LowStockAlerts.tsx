'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateStock } from '@/app/actions/product.actions'

type Product = {
  id: string
  name: string
  stock: number
  sku: string | null
}

function stockColor(stock: number) {
  if (stock === 0) return 'text-red-400 border-red-500/30 bg-red-500/10'
  if (stock < 10) return 'text-amber-300 border-amber-500/30 bg-amber-500/10'
  return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
}

export function LowStockAlerts({ products }: { products: Product[] }) {
  const [pending, startTransition] = useTransition()
  const [values, setValues] = useState<Record<string, string>>({})

  function restock(id: string) {
    const stock = parseInt(values[id] ?? '', 10)
    if (!Number.isInteger(stock) || stock < 0) {
      toast.error('Enter a valid stock number')
      return
    }
    startTransition(async () => {
      const res = await updateStock(id, stock)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Stock updated')
        setValues((v) => ({ ...v, [id]: '' }))
      }
    })
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-cream/40 font-body p-4">All products are well stocked.</p>
    )
  }

  return (
    <ul className="divide-y divide-cream/5">
      {products.map((p) => (
        <li key={p.id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="min-w-0">
            <p className="text-sm text-cream truncate">{p.name}</p>
            {p.sku && <p className="text-xs text-cream/40 font-mono">{p.sku}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${stockColor(p.stock)}`}
            >
              {p.stock} left
            </span>
            <input
              type="number"
              min={0}
              placeholder="Qty"
              value={values[p.id] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [p.id]: e.target.value }))}
              className="input-field w-20 py-2 text-xs"
            />
            <button
              type="button"
              disabled={pending}
              onClick={() => restock(p.id)}
              className="px-3 py-2 text-[10px] uppercase tracking-widest bg-electric text-void rounded-lg font-body hover:opacity-90 disabled:opacity-50"
            >
              Restock
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
