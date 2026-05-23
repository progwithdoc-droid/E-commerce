import { Suspense } from 'react'
import { getCategories, getProducts } from '@/app/actions/products'
import { CatalogProductGrid } from '@/components/home/CatalogProductGrid'
import { ProductFilters } from '@/components/home/ProductFilters'
import { Pagination } from '@/components/home/Pagination'

type SearchParams = Promise<{
  category?: string
  search?: string
  sort?: string
  page?: string
}>

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const page = Number(params.page ?? '1') || 1
  const { products, totalPages, total } = await getProducts({
    category: params.category,
    search: params.search,
    sort: params.sort,
    page,
  })
  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-void pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-5xl text-cream tracking-wider mb-2">SHOP</h1>
        <p className="text-cream/50 text-sm font-body mb-10">{total} products</p>

        <div className="flex flex-col lg:flex-row gap-10">
          <Suspense fallback={<div className="w-56 h-48 bg-cream/5 animate-pulse rounded" />}>
            <ProductFilters categories={categories} />
          </Suspense>
          <div className="flex-1">
            <Suspense fallback={<div className="animate-pulse h-96 bg-cream/5 rounded" />}>
              <CatalogProductGrid products={products} />
            </Suspense>
            <Pagination
              page={page}
              totalPages={totalPages}
              searchParams={params}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
