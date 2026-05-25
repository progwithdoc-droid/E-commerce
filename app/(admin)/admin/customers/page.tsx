import { CustomersTable } from '@/components/admin/CustomersTable'
import { getAllCustomers } from '@/app/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-electric mb-1">Community</p>
        <h1 className="font-display text-4xl text-cream">Customers</h1>
      </div>
      <CustomersTable customers={customers} />
    </div>
  )
}
