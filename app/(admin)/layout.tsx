import { requireAdmin } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  return (
    <div className="min-h-screen bg-void text-cream cursor-auto">
      <div className="lg:grid lg:grid-cols-[280px_1fr] min-h-screen">
        <div className="lg:border-r lg:border-cream/10 lg:p-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <AdminSidebar email={session.user.email} />
        </div>
        <main className="p-6 lg:p-10 max-w-[1400px]">{children}</main>
      </div>
    </div>
  )
}
