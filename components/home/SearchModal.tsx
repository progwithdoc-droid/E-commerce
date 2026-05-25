'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { searchProducts } from '@/app/actions/products'
import type { ProductCard } from '@/app/actions/products'

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const RECENT_KEY = 'aurum_recent_searches'
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductCard[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [recent, setRecent] = useState<string[]>([])
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setRecent(parsed.slice(0, 6))
    } catch {
      // ignore invalid storage
    }
  }, [])

  function saveRecent(value: string) {
    const cleaned = value.trim()
    if (cleaned.length < 2) return
    const next = [cleaned, ...recent.filter((r) => r.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6)
    setRecent(next)
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  }

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const runSearch = useCallback((value: string) => {
    startTransition(async () => {
      const items = await searchProducts(value)
      setResults(items)
      setActiveIndex(0)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) runSearch(query)
      else setResults([])
    }, 300)
    return () => clearTimeout(timer)
  }, [query, runSearch])

  function goToProduct(slug: string) {
    saveRecent(query)
    onClose()
    router.push(`/products/${slug}`)
  }

  function goToAll() {
    saveRecent(query)
    onClose()
    router.push(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (results[activeIndex]) goToProduct(results[activeIndex].slug)
      else if (query.trim()) goToAll()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            className="fixed left-1/2 top-[15vh] z-[201] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 border border-cream/15 rounded-xl bg-surface shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-cream/10">
              <Search size={18} className="text-cream/40 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search products…"
                className="flex-1 bg-transparent text-cream text-sm outline-none placeholder:text-cream/30"
              />
              <button type="button" onClick={onClose} className="text-cream/40 hover:text-cream">
                <X size={18} />
              </button>
            </div>

            <p className="px-4 py-2 text-[10px] text-cream/30 border-b border-cream/5">
              ⌘K to open · ↑↓ navigate · Enter to select
            </p>
            <div className="max-h-[50vh] overflow-y-auto">
              {!pending && query.trim().length < 2 && recent.length > 0 && (
                <div className="p-4 border-b border-cream/5">
                  <p className="text-[10px] uppercase tracking-widest text-cream/35 mb-2">Recent</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term)
                          runSearch(term)
                        }}
                        className="px-2.5 py-1 rounded-full border border-cream/20 text-[10px] uppercase tracking-wider text-cream/60 hover:text-electric hover:border-electric/30"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {pending && (
                <p className="p-6 text-sm text-cream/40 text-center">Searching…</p>
              )}
              {!pending && query.trim().length >= 2 && results.length === 0 && (
                <p className="p-6 text-sm text-cream/40 text-center">No products found.</p>
              )}
              {!pending &&
                results.map((product, i) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => goToProduct(product.slug)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-cream/5 transition-colors ${
                      i === activeIndex ? 'bg-cream/5' : ''
                    }`}
                  >
                    <div className="relative w-10 h-12 rounded bg-cream/5 overflow-hidden shrink-0">
                      <Image src={product.image} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cream truncate">{product.name}</p>
                      <p className="text-xs text-cream/40">{product.category}</p>
                    </div>
                    <span className="text-sm text-cream font-body">${product.price}</span>
                  </button>
                ))}
              {!pending && query.trim().length >= 2 && results.length > 0 && (
                <div className="border-t border-cream/10 p-3">
                  <button
                    type="button"
                    onClick={goToAll}
                    className="w-full py-2 text-[10px] uppercase tracking-widest text-electric hover:text-cream transition-colors"
                  >
                    View all results for &ldquo;{query.trim()}&rdquo;
                  </button>
                </div>
              )}
              {query.trim().length < 2 && (
                <p className="p-6 text-xs text-cream/40 text-center">
                  Type at least 2 characters · Press Enter to search all
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
