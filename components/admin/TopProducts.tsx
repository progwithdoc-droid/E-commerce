import Image from 'next/image'
import Link from 'next/link'

type Item = {
  id: string
  name: string
  slug: string
  image: string | null
  qty: number
  revenue: number
  stock: number
}

function stockBadge(stock: number) {
  if (stock === 0) return { label: 'Out', className: 'text-red-400 border-red-500/30' }
  if (stock < 10) return { label: 'Low', className: 'text-amber-300 border-amber-500/30' }
  return { label: 'OK', className: 'text-emerald-400 border-emerald-500/30' }
}

export function TopProducts({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-cream/40 font-body p-4">No sales in the last 30 days.</p>
  }

  return (
    <ul className="divide-y divide-cream/5">
      {items.map((item, i) => {
        const badge = stockBadge(item.stock)
        return (
          <li key={item.id} className="p-4 flex items-center gap-4">
            <span className="text-cream/30 font-display text-xl w-6">{i + 1}</span>
            <div className="relative w-12 h-14 rounded-md overflow-hidden bg-cream/5 shrink-0">
              {item.image ? (
                <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/products/${item.id}`}
                className="text-sm text-cream hover:text-electric truncate block"
              >
                {item.name}
              </Link>
              <p className="text-xs text-cream/45 mt-0.5">
                {item.qty} sold · ${item.revenue.toFixed(2)} revenue
              </p>
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${badge.className}`}
            >
              {badge.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
