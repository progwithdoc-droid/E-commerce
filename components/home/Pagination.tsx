import Link from 'next/link'

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  function href(p: number) {
    const q = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== 'page') q.set(k, v)
    })
    if (p > 1) q.set('page', String(p))
    const s = q.toString()
    return s ? `/products?${s}` : '/products'
  }

  return (
    <nav className="flex justify-center gap-4 mt-12">
      {page > 1 && (
        <Link href={href(page - 1)} className="text-sm text-cream/70 hover:text-cream font-body">
          ← Previous
        </Link>
      )}
      <span className="text-sm text-cream/50 font-body">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link href={href(page + 1)} className="text-sm text-cream/70 hover:text-cream font-body">
          Next →
        </Link>
      )}
    </nav>
  )
}
