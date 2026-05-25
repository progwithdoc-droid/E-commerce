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

const STACK_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  PROCESSING: '#3b82f6',
  PAID: '#60a5fa',
  SHIPPED: '#a855f7',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
}

type Row = Record<string, string | number>

export function OrdersChart({ data }: { data: Row[] }) {
  const keys = Object.keys(STACK_COLORS)

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          <Legend
            wrapperStyle={{ fontSize: 10, color: 'rgba(245,240,232,0.5)' }}
            iconType="circle"
          />
          {keys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={STACK_COLORS[key]}
              radius={key === 'DELIVERED' ? [4, 4, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
