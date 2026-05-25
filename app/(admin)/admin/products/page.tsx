import { ProductsTable } from '@/components/admin/ProductsTable'
import { getAdminProducts, getAdminCategories } from '@/app/actions/product.actions'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-electric mb-1">Catalog</p>
        <h1 className="font-display text-4xl text-cream">Products</h1>
      </div>
      <ProductsTable products={products} categories={categories} />
    </div>
  )
}
