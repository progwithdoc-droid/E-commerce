'use server'

import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export type ProductCard = {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string
  category: string
  categorySlug: string | null
}

function toCard(
  p: {
    id: string
    name: string
    slug: string
    price: Prisma.Decimal
    comparePrice: Prisma.Decimal | null
    images: string[]
    category: { name: string; slug: string } | null
  }
): ProductCard {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    image: p.images[0] ?? 'https://images.unsplash.com/photo-1523381210434-271e8be1eaf4?w=800&q=80',
    category: p.category?.name ?? 'Uncategorized',
    categorySlug: p.category?.slug ?? null,
  }
}

const getFeaturedProductsCached = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    })
    return products.map(toCard)
  },
  ['products:featured'],
  { tags: ['products'] }
)

export async function getFeaturedProducts(limit = 8) {
  const items = await getFeaturedProductsCached()
  return items.slice(0, limit)
}

const getCategoriesCached = unstable_cache(
  async () => {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
  },
  ['products:categories'],
  { tags: ['products'] }
)

export async function getCategories() {
  return getCategoriesCached()
}

type ProductQueryParams = {
  category?: string
  search?: string
  sort?: string
  page?: number
  pageSize?: number
}

const getProductsCached = unstable_cache(
  async (params: ProductQueryParams) => {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 12
    const skip = (page - 1) * pageSize

    const where: Prisma.ProductWhereInput = {}

    if (params.category) {
      where.category = { slug: params.category }
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    if (params.sort === 'price-asc') orderBy = { price: 'asc' }
    if (params.sort === 'price-desc') orderBy = { price: 'desc' }
    if (params.sort === 'name') orderBy = { name: 'asc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return {
      products: products.map(toCard),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },
  ['products:list'],
  { tags: ['products'] }
)

export async function getProducts(params: ProductQueryParams) {
  return getProductsCached(params)
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, reviews: { take: 5, orderBy: { createdAt: 'desc' } } },
  })
  if (!product) return null

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId ?? undefined,
      id: { not: product.id },
    },
    take: 4,
    include: { category: true },
  })

  return {
    ...toCard(product),
    description: product.description,
    images: product.images.length > 0 ? product.images : [toCard(product).image],
    stock: product.stock,
    sku: product.sku,
    reviews: product.reviews.map((r) => ({
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
    related: related.map(toCard),
  }
}

export async function searchProducts(query: string, limit = 8) {
  const q = query.trim()
  if (q.length < 2) return []

  const { products } = await getProducts({ search: q, pageSize: limit })
  return products
}
