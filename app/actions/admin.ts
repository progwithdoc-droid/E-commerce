'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { sendCustomerEmail } from '@/lib/email'
import { getStripe } from '@/lib/stripe'

export type Period = '7' | '30' | '90' | '365'

function periodDays(p: Period) {
  return p === '7' ? 7 : p === '30' ? 30 : p === '90' ? 90 : 365
}

function periodRange(days: number) {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - days)
  const prevEnd = new Date(start)
  const prevStart = new Date(prevEnd)
  prevStart.setDate(prevStart.getDate() - days)
  return { start, end, prevStart, prevEnd }
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function sumOrders(orders: { total: { toString(): string } }[]) {
  return orders.reduce((s, o) => s + Number(o.total), 0)
}

export async function getDashboardMetrics(period: Period = '30') {
  await requireAdmin()
  const days = periodDays(period)
  const { start, end, prevStart, prevEnd } = periodRange(days)

  const [currentOrders, previousOrders, currentCustomers, previousCustomers] =
    await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: start, lte: end }, status: { not: 'CANCELLED' } },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: prevStart, lt: prevEnd }, status: { not: 'CANCELLED' } },
        select: { total: true },
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: start, lte: end } },
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: prevStart, lt: prevEnd } },
      }),
    ])

  const revenue = sumOrders(currentOrders)
  const prevRevenue = sumOrders(previousOrders)
  const orderCount = currentOrders.length
  const prevOrderCount = previousOrders.length
  const aov = orderCount > 0 ? revenue / orderCount : 0
  const prevAov = prevOrderCount > 0 ? prevRevenue / prevOrderCount : 0

  return {
    revenue: { value: revenue, change: pctChange(revenue, prevRevenue) },
    orders: { value: orderCount, change: pctChange(orderCount, prevOrderCount) },
    customers: { value: currentCustomers, change: pctChange(currentCustomers, previousCustomers) },
    aov: { value: aov, change: pctChange(aov, prevAov) },
  }
}

export async function getRevenueChartData(period: Period = '30') {
  await requireAdmin()
  const days = periodDays(period)
  const { start } = periodRange(days)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start }, status: { not: 'CANCELLED' } },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  const byDay = new Map<string, number>()
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    byDay.set(d.toISOString().slice(0, 10), 0)
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10)
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + Number(o.total))
  }

  return Array.from(byDay.entries()).map(([date, revenue]) => ({
    date: date.slice(5),
    revenue: Math.round(revenue * 100) / 100,
  }))
}

const STATUSES = ['PENDING', 'PROCESSING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const

export async function getOrdersChartData(period: Period = '30') {
  await requireAdmin()
  const days = periodDays(period)
  const { start } = periodRange(days)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start } },
    select: { status: true, createdAt: true },
  })

  const byDay = new Map<string, Record<string, number>>()
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().slice(0, 10)
    const row: Record<string, number> = {}
    for (const s of STATUSES) row[s] = 0
    byDay.set(key, row)
  }

  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10)
    const row = byDay.get(key)
    if (row) {
      const status = STATUSES.includes(o.status as (typeof STATUSES)[number])
        ? o.status
        : 'PENDING'
      row[status] = (row[status] ?? 0) + 1
    }
  }

  return Array.from(byDay.entries()).map(([date, counts]) => ({
    date: date.slice(5),
    ...counts,
    total: Object.values(counts).reduce((a, b) => a + b, 0),
  }))
}

export async function getRecentOrders(limit = 10) {
  await requireAdmin()
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  })
}

export async function getLowStockProducts(threshold = 10) {
  await requireAdmin()
  return prisma.product.findMany({
    where: { stock: { lt: threshold } },
    orderBy: { stock: 'asc' },
    take: 20,
    include: { category: true },
  })
}

export async function getTopProducts(days = 30) {
  await requireAdmin()
  const start = new Date()
  start.setDate(start.getDate() - days)

  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: start }, status: { not: 'CANCELLED' } } },
    include: { product: true },
  })

  const map = new Map<
    string,
    { product: (typeof items)[0]['product']; qty: number; revenue: number }
  >()

  for (const item of items) {
    const cur = map.get(item.productId) ?? {
      product: item.product,
      qty: 0,
      revenue: 0,
    }
    cur.qty += item.quantity
    cur.revenue += Number(item.price) * item.quantity
    map.set(item.productId, cur)
  }

  return Array.from(map.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8)
    .map((r) => ({
      id: r.product.id,
      name: r.product.name,
      slug: r.product.slug,
      image: r.product.images[0] ?? null,
      qty: r.qty,
      revenue: r.revenue,
      stock: r.product.stock,
    }))
}

export async function getCustomerInsights(days = 30) {
  await requireAdmin()
  const start = new Date()
  start.setDate(start.getDate() - days)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start }, userId: { not: null }, status: { not: 'CANCELLED' } },
    select: { userId: true, createdAt: true, total: true },
    orderBy: { createdAt: 'asc' },
  })

  const firstOrderByUser = await prisma.order.groupBy({
    by: ['userId'],
    where: { userId: { not: null } },
    _min: { createdAt: true },
  })
  const firstMap = new Map(
    firstOrderByUser.filter((f) => f.userId).map((f) => [f.userId!, f._min.createdAt!])
  )

  const acquisition = new Map<string, { new: number; returning: number }>()
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    acquisition.set(d.toISOString().slice(0, 10), { new: 0, returning: 0 })
  }

  for (const o of orders) {
    if (!o.userId) continue
    const key = o.createdAt.toISOString().slice(0, 10)
    const bucket = acquisition.get(key)
    if (!bucket) continue
    const first = firstMap.get(o.userId)
    if (first && first.toISOString().slice(0, 10) === key) bucket.new += 1
    else bucket.returning += 1
  }

  const spendByUser = new Map<string, number>()
  for (const o of orders) {
    if (!o.userId) continue
    spendByUser.set(o.userId, (spendByUser.get(o.userId) ?? 0) + Number(o.total))
  }

  const topIds = Array.from(spendByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)

  const topUsers = await prisma.user.findMany({
    where: { id: { in: topIds } },
    select: { id: true, name: true, email: true },
  })

  const topCustomers = topIds.map((id) => {
    const user = topUsers.find((u) => u.id === id)
    return {
      id,
      name: user?.name ?? 'Guest',
      email: user?.email ?? '',
      spent: spendByUser.get(id) ?? 0,
    }
  })

  return {
    acquisition: Array.from(acquisition.entries()).map(([date, v]) => ({
      date: date.slice(5),
      new: v.new,
      returning: v.returning,
    })),
    topCustomers,
  }
}

export async function getAllOrders(filters?: { status?: string; from?: string; to?: string }) {
  await requireAdmin()
  const where: Prisma.OrderWhereInput = {}

  if (filters?.status && filters.status !== 'ALL') {
    where.status = filters.status
  }
  if (filters?.from || filters?.to) {
    where.createdAt = {}
    if (filters.from) where.createdAt.gte = new Date(filters.from)
    if (filters.to) {
      const to = new Date(filters.to)
      to.setHours(23, 59, 59, 999)
      where.createdAt.lte = to
    }
  }

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  })
}

export async function getOrderById(id: string) {
  await requireAdmin()
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  })
}

const statusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
])

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()
  const parsed = statusSchema.safeParse(status)
  if (!parsed.success) return { error: 'Invalid status' }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: parsed.data },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  revalidateTag('orders')
  return { success: true }
}

export async function issueRefund(orderId: string) {
  await requireAdmin()
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return { error: 'Order not found' }

  if (order.stripePaymentId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = getStripe()
      const session = await stripe.checkout.sessions.retrieve(order.stripePaymentId)
      const paymentIntent =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id
      if (paymentIntent) {
        await stripe.refunds.create({ payment_intent: paymentIntent })
      }
    } catch {
      return { error: 'Stripe refund failed. Check payment ID and keys.' }
    }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  })

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  revalidateTag('orders')
  return { success: true }
}

export async function getAllCustomers(search?: string) {
  await requireAdmin()
  const where: Prisma.UserWhereInput = {
    role: { in: ['CUSTOMER', 'SUSPENDED'] },
  }
  if (search?.trim()) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true } },
      orders: {
        where: { status: { not: 'CANCELLED' } },
        select: { total: true },
      },
    },
  })

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    orderCount: u._count.orders,
    totalSpent: u.orders.reduce((s, o) => s + Number(o.total), 0),
  }))
}

export async function getCustomerById(id: string) {
  await requireAdmin()
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } },
      },
      addresses: true,
    },
  })
  if (!user) return null

  const totalSpent = user.orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((s, o) => s + Number(o.total), 0)

  return { ...user, totalSpent }
}

const emailSchema = z.object({
  customerId: z.string(),
  subject: z.string().min(1),
  body: z.string().min(1),
})

export async function sendCustomerEmailAction(_prev: unknown, formData: FormData) {
  await requireAdmin()
  const parsed = emailSchema.safeParse({
    customerId: formData.get('customerId'),
    subject: formData.get('subject'),
    body: formData.get('body'),
  })
  if (!parsed.success) return { error: 'Invalid email data' }

  const user = await prisma.user.findUnique({ where: { id: parsed.data.customerId } })
  if (!user?.email) return { error: 'Customer not found' }

  const result = await sendCustomerEmail({
    to: user.email,
    subject: parsed.data.subject,
    body: parsed.data.body,
  })
  if ('error' in result && result.error) return { error: result.error }
  return { success: true }
}

export async function suspendCustomer(customerId: string) {
  await requireAdmin()
  await prisma.$transaction([
    prisma.user.update({
      where: { id: customerId },
      data: { role: 'SUSPENDED' },
    }),
    prisma.session.deleteMany({ where: { userId: customerId } }),
  ])
  revalidatePath('/admin/customers')
  revalidatePath(`/admin/customers/${customerId}`)
  return { success: true }
}

export async function unsuspendCustomer(customerId: string) {
  await requireAdmin()
  await prisma.user.update({
    where: { id: customerId },
    data: { role: 'CUSTOMER' },
  })
  revalidatePath('/admin/customers')
  return { success: true }
}
