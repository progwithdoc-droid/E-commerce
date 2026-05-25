'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

type Props = {
  acquisition: { date: string; new: number; returning: number }[]
  topCustomers: { id: string; name: string; email: string; spent: number }[]
}

export function CustomerInsights({ acquisition, topCustomers }: Props) {
  return (
    <div className="space-y-8">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={acquisition} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(245,240,232,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(245,240,232,0.4)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(245,240,232,0.4)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#0D0D0D',
                border: '1px solid rgba(245,240,232,0.15)',
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} iconType="circle" />
            <Bar dataKey="new" name="New" fill="#C8FF00" radius={[4, 4, 0, 0]} />
            <Bar dataKey="returning" name="Returning" fill="rgba(245,240,232,0.35)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest text-cream/45 mb-3">Top spenders</p>
        <ul className="space-y-2">
          {topCustomers.map((c, i) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 text-sm font-body border border-cream/5 rounded-lg px-3 py-2"
            >
              <span className="text-cream/50 w-5">{i + 1}</span>
              <span className="flex-1 truncate text-cream">{c.name}</span>
              <span className="text-electric font-mono text-xs">${c.spent.toFixed(2)}</span>
            </li>
          ))}
          {topCustomers.length === 0 && (
            <p className="text-xs text-cream/40">No customer data yet.</p>
          )}
        </ul>
      </div>
    </div>
  )
}
