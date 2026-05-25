'use client'

import { useMounted } from '@/app/hooks/useMounted'
import { useCart } from '@/app/store/cart'

export function CartCountBadge() {
  const mounted = useMounted()
  const totalItems = useCart((s) => s.totalItems())

  if (!mounted || totalItems <= 0) return null

  return (
    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-electric text-void text-[10px] font-bold rounded-full flex items-center justify-center">
      {totalItems}
    </span>
  )
}
