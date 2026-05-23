'use server'

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
    image: p.images[0] ?? '/placeholder-product.jpg',
    category: p.category?.name ?? 'Uncategorized',
    categorySlug: p.category?.slug ?? null,
  }
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })
  return products.map(toCard)
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getProducts(params: {
  category?: string
  search?: string
  sort?: string
  page?: number
  pageSize?: number
}) {
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
    images: product.images,
    stock: product.stock,
    sku: product.sku,
    related: related.map(toCard),
  }
}
