import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import { MetricCard } from '@/components/admin/MetricCard'
import { DashboardCharts } from '@/components/admin/DashboardCharts'
import { RecentOrdersTable } from '@/components/admin/RecentOrdersTable'
import { LowStockAlerts } from '@/components/admin/LowStockAlerts'
import { TopProducts } from '@/components/admin/TopProducts'
import { CustomerInsights } from '@/components/admin/CustomerInsights'
import {
  getDashboardMetrics,
  getRecentOrders,
  getLowStockProducts,
  getTopProducts,
  getCustomerInsights,
} from '@/app/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [metrics, recentOrders, lowStock, topProducts, insights] = await Promise.all([
    getDashboardMetrics('30'),
    getRecentOrders(12),
    getLowStockProducts(),
    getTopProducts(30),
    getCustomerInsights(30),
  ])

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-electric mb-1">Overview</p>
        <h1 className="font-display text-4xl text-cream">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total revenue"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          format="currency"
          icon={DollarSign}
        />
        <MetricCard
          label="Total orders"
          value={metrics.orders.value}
          change={metrics.orders.change}
          icon={ShoppingBag}
        />
        <MetricCard
          label="Customers"
          value={metrics.customers.value}
          change={metrics.customers.change}
          icon={Users}
        />
        <MetricCard
          label="Avg order value"
          value={metrics.aov.value}
          change={metrics.aov.change}
          format="currency"
          icon={TrendingUp}
        />
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 border border-cream/10 rounded-xl bg-surface/30 overflow-hidden">
          <div className="p-5 border-b border-cream/10">
            <h2 className="font-display text-xl text-cream">Recent orders</h2>
          </div>
          <div className="p-4">
            <RecentOrdersTable orders={recentOrders} />
          </div>
        </div>
        <div className="border border-cream/10 rounded-xl bg-surface/30">
          <div className="p-5 border-b border-cream/10">
            <h2 className="font-display text-xl text-cream">Low stock</h2>
          </div>
          <LowStockAlerts products={lowStock} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-cream/10 rounded-xl bg-surface/30">
          <div className="p-5 border-b border-cream/10">
            <h2 className="font-display text-xl text-cream">Top products</h2>
            <p className="text-xs text-cream/40 mt-1">Last 30 days</p>
          </div>
          <TopProducts items={topProducts} />
        </div>
        <div className="border border-cream/10 rounded-xl bg-surface/30 p-5">
          <h2 className="font-display text-xl text-cream mb-4">Customer insights</h2>
          <CustomerInsights
            acquisition={insights.acquisition}
            topCustomers={insights.topCustomers}
          />
        </div>
      </div>
    </div>
  )
}
