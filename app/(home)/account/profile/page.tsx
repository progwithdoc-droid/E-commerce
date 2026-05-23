import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileForms } from '@/components/account/ProfileForms'

export default async function ProfilePage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: { name: true, email: true, password: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-cream">Profile</h2>
        <p className="text-cream/50 text-sm font-body mt-1">{user?.email}</p>
      </div>
      <ProfileForms name={user?.name ?? null} hasPassword={Boolean(user?.password)} />
    </div>
  )
}
