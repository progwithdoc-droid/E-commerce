'use server'

import { hash, compare } from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
})

export async function updateProfile(_prev: unknown, formData: FormData) {
  const userId = await requireUserId()
  const parsed = profileSchema.safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: 'Invalid name' }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
  })
  revalidatePath('/account')
  return { success: true }
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export async function changePassword(_prev: unknown, formData: FormData) {
  const userId = await requireUserId()
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })
  if (!parsed.success) return { error: 'Check your password fields' }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.password) {
    return { error: 'Password change not available for social login accounts' }
  }

  const valid = await compare(parsed.data.currentPassword, user.password)
  if (!valid) return { error: 'Current password is incorrect' }

  await prisma.user.update({
    where: { id: userId },
    data: { password: await hash(parsed.data.newPassword, 12) },
  })
  return { success: true }
}

const addressSchema = z.object({
  name: z.string().trim().min(2),
  street: z.string().trim().min(3),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  zip: z.string().trim().min(3),
  country: z.string().trim().default('US'),
  isDefault: z.coerce.boolean().optional(),
})

export async function createAddress(_prev: unknown, formData: FormData) {
  const userId = await requireUserId()
  const parsed = addressSchema.safeParse({
    name: formData.get('name'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip: formData.get('zip'),
    country: formData.get('country') || 'US',
    isDefault: formData.get('isDefault') === 'on',
  })
  if (!parsed.success) return { error: 'Invalid address' }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    })
  }

  await prisma.address.create({
    data: { userId, ...parsed.data, isDefault: parsed.data.isDefault ?? false },
  })
  revalidatePath('/account/addresses')
  return { success: true }
}

export async function deleteAddress(addressId: string) {
  const userId = await requireUserId()
  await prisma.address.deleteMany({ where: { id: addressId, userId } })
  revalidatePath('/account/addresses')
  return { success: true }
}

export async function toggleWishlist(productId: string) {
  const userId = await requireUserId()
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  })

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } })
    revalidatePath('/account/wishlist')
    return { success: true, added: false }
  }

  await prisma.wishlist.create({ data: { userId, productId } })
  revalidatePath('/account/wishlist')
  return { success: true, added: true }
}
