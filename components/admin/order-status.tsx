const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  PROCESSING: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  PAID: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  SHIPPED: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  DELIVERED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  CANCELLED: 'bg-red-500/15 text-red-300 border-red-500/30',
}

export function OrderStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-cream/10 text-cream/70 border-cream/20'
  return (
    <span
      className={`inline-flex text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-body ${style}`}
    >
      {status}
    </span>
  )
}

export const ORDER_STATUSES = [
  'PENDING',
  'PROCESSING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const
