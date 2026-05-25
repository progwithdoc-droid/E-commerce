import { notFound } from 'next/navigation'
import { ProductEditClient } from '@/components/admin/ProductEditClient'
import { getProductById, getAdminCategories } from '@/app/actions/product.actions'

export const dynamic = 'force-dynamic'

export default async function AdminProductEditPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getAdminCategories(),
  ])

  if (!product) notFound()

  return <ProductEditClient product={product} categories={categories} />
}
