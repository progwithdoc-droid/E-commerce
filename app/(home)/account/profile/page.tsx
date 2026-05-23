import { auth } from '@/lib/auth'

export default async function ProfilePage() {
  const session = await auth()
  return (
    <div>
      <h1 className="font-display text-3xl mb-4">Profile</h1>
      <p className="text-cream/60 font-body text-sm">Email: {session?.user?.email}</p>
    </div>
  )
}
