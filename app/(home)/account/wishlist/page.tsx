import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { WishlistGrid } from '@/components/account/WishlistGrid'

export default async function WishlistPage() {
  const session = await auth()
  const items = await prisma.wishlist.findMany({
    where: { userId: session!.user!.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-cream">Wishlist</h2>
        <p className="text-cream/50 text-sm font-body mt-1">Saved pieces you love</p>
      </div>
      <WishlistGrid items={items} />
    </div>
  )
}
