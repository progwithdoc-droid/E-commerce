import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  if (session.user.role !== 'ADMIN') redirect('/admin/login?error=not_admin')
  return session
}
