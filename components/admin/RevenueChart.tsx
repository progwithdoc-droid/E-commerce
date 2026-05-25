'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Point = { date: string; revenue: number }

export function RevenueChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: '#0D0D0D',
              border: '1px solid rgba(245,240,232,0.15)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#F5F0E8' }}
            formatter={(value) => [
              `$${Number(value ?? 0).toFixed(2)}`,
              'Revenue',
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#C8FF00"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#C8FF00' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
