import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AddressManager } from '@/components/account/AddressManager'

export default async function AddressesPage() {
  const session = await auth()
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user!.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-cream">Addresses</h2>
        <p className="text-cream/50 text-sm font-body mt-1">Manage shipping destinations</p>
      </div>
      <AddressManager addresses={addresses} />
    </div>
  )
}
