'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.union([z.coerce.number().positive(), z.literal('')]).optional(),
  stock: z.coerce.number().int().min(0),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  images: z.string(), // comma-separated URLs
})

export async function getAdminProducts(search?: string) {
  await requireAdmin()
  const where = search?.trim()
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  return prisma.product.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })
}

export async function getProductById(id: string) {
  await requireAdmin()
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function getProductBySlug(slug: string) {
  await requireAdmin()
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function createProduct(input: z.infer<typeof productSchema>) {
  await requireAdmin()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid product data' }

  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name)
  const images = parsed.data.images
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  try {
    await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: parsed.data.price,
        comparePrice:
          parsed.data.comparePrice != null && parsed.data.comparePrice !== ''
            ? Number(parsed.data.comparePrice)
            : null,
        stock: parsed.data.stock,
        sku: parsed.data.sku || null,
        categoryId: parsed.data.categoryId || null,
        images,
      },
    })
  } catch {
    return { error: 'Could not create product. Slug may already exist.' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidateTag('products')
  return { success: true }
}

export async function updateProduct(id: string, input: z.infer<typeof productSchema>) {
  await requireAdmin()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid product data' }

  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name)
  const images = parsed.data.images
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: parsed.data.price,
        comparePrice:
          parsed.data.comparePrice != null && parsed.data.comparePrice !== ''
            ? Number(parsed.data.comparePrice)
            : null,
        stock: parsed.data.stock,
        sku: parsed.data.sku || null,
        categoryId: parsed.data.categoryId || null,
        images,
      },
    })
  } catch {
    return { error: 'Could not update product.' }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/products')
  revalidateTag('products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  try {
    await prisma.product.delete({ where: { id } })
  } catch {
    return { error: 'Cannot delete product with existing orders.' }
  }
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidateTag('products')
  return { success: true }
}

export async function updateStock(productId: string, stock: number) {
  await requireAdmin()
  if (!Number.isInteger(stock) || stock < 0) return { error: 'Invalid stock' }

  await prisma.product.update({
    where: { id: productId },
    data: { stock },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidateTag('products')
  return { success: true }
}

export async function getAdminCategories() {
  await requireAdmin()
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}
