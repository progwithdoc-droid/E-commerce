import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import { getProductBySlug } from '@/app/actions/products'
import { ProductDetail } from '@/components/home/ProductDetail'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — AURUM STORE`,
    description: product.description ?? undefined,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <main className="min-h-screen bg-void pt-24 pb-24 px-6 lg:px-12">
      <ProductDetail product={product} />
    </main>
  )
}
