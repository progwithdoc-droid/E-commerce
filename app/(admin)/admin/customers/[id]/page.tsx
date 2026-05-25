import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CustomerDetailPanel } from '@/components/admin/CustomerDetailPanel'
import { getCustomerById } from '@/app/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const customer = await getCustomerById(params.id)
  if (!customer) notFound()

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="text-xs uppercase tracking-widest text-cream/50 hover:text-cream"
      >
        ← Customers
      </Link>
      <CustomerDetailPanel customer={customer} />
    </div>
  )
}
