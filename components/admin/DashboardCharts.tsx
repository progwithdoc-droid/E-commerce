'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useTransition } from 'react'
import { PeriodFilter } from '@/components/admin/PeriodFilter'
import type { Period } from '@/app/actions/admin'
import { getRevenueChartData, getOrdersChartData } from '@/app/actions/admin'

const RevenueChart = dynamic(
  () => import('@/components/admin/RevenueChart').then((m) => m.RevenueChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

const OrdersChart = dynamic(
  () => import('@/components/admin/OrdersChart').then((m) => m.OrdersChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

function ChartSkeleton() {
  return <div className="h-[280px] rounded-lg bg-cream/5 animate-pulse" />
}

export function DashboardCharts({
  initialPeriod = '30',
}: {
  initialPeriod?: Period
}) {
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [revenue, setRevenue] = useState<{ date: string; revenue: number }[]>([])
  const [orders, setOrders] = useState<Record<string, string | number>[]>([])
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const [rev, ord] = await Promise.all([
        getRevenueChartData(period),
        getOrdersChartData(period),
      ])
      setRevenue(rev)
      setOrders(ord)
    })
  }, [period])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="border border-cream/10 rounded-xl p-5 bg-surface/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-xl text-cream">Revenue</h3>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
        {pending && revenue.length === 0 ? (
          <ChartSkeleton />
        ) : (
          <RevenueChart data={revenue} />
        )}
      </div>
      <div className="border border-cream/10 rounded-xl p-5 bg-surface/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-xl text-cream">Orders by status</h3>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
        {pending && orders.length === 0 ? (
          <ChartSkeleton />
        ) : (
          <OrdersChart data={orders} />
        )}
      </div>
    </div>
  )
}
