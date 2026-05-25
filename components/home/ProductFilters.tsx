'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Category = { id: string; name: string; slug: string }

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    update('search', searchInput.trim() || null)
  }

  return (
    <aside className="w-full lg:w-56 shrink-0 space-y-8">
      <form onSubmit={submitSearch}>
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-cream/50 mb-4">Search</h3>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Product name…"
          className="input-field text-sm py-2"
        />
      </form>
      <div>
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-cream/50 mb-4">Category</h3>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => update('category', null)}
              className="text-sm text-cream/70 hover:text-cream font-body"
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => update('category', cat.slug)}
                className="text-sm text-cream/70 hover:text-cream font-body"
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-cream/50 mb-4">Sort</h3>
        <select
          className="w-full bg-transparent border border-cream/20 rounded px-3 py-2 text-sm text-cream"
          value={searchParams.get('sort') ?? 'newest'}
          onChange={(e) => update('sort', e.target.value === 'newest' ? null : e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>
    </aside>
  )
}
