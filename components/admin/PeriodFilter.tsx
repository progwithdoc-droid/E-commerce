'use client'

import type { Period } from '@/app/actions/admin'

const OPTIONS: { value: Period; label: string }[] = [
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
  { value: '90', label: '90D' },
  { value: '365', label: '1Y' },
]

export function PeriodFilter({
  value,
  onChange,
}: {
  value: Period
  onChange: (p: Period) => void
}) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-void border border-cream/10">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-body rounded-md transition-all ${
            value === opt.value
              ? 'bg-electric text-void'
              : 'text-cream/50 hover:text-cream'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
