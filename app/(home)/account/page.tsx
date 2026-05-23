import { auth } from '@/lib/auth'

export default async function AccountPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl tracking-wide">Your Account</h1>
      <div className="space-y-2 font-body text-sm text-cream/80 border border-cream/10 rounded-lg p-6">
        <p>
          <span className="text-cream/50">Name:</span> {session?.user?.name ?? '—'}
        </p>
        <p>
          <span className="text-cream/50">Email:</span> {session?.user?.email}
        </p>
        <p>
          <span className="text-cream/50">Role:</span> {session?.user?.role}
        </p>
        <p className="text-cream/40 text-xs mt-4">
          Google users: password is empty in the database — that is normal. Check the{' '}
          <strong>User</strong> table in Prisma Studio, not <strong>Account</strong>.
        </p>
      </div>
    </div>
  )
}
