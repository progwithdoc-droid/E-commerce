import { TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function MetricCard({
  label,
  value,
  change,
  format = 'number',
  icon: Icon,
}: {
  label: string
  value: number
  change: number
  format?: 'currency' | 'number'
  icon: LucideIcon
}) {
  const display =
    format === 'currency'
      ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : value.toLocaleString()

  const up = change >= 0

  return (
    <div className="border border-cream/10 rounded-xl p-5 bg-surface/60 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cream/45 font-body">{label}</p>
          <p className="font-display text-3xl text-cream mt-2">{display}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-electric/10 text-electric border border-electric/20">
          <Icon size={18} strokeWidth={1.5} />
        </div>
      </div>
      <div
        className={`flex items-center gap-1 mt-4 text-xs font-body ${
          up ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>
          {up ? '+' : ''}
          {change}% vs prior period
        </span>
      </div>
    </div>
  )
}
