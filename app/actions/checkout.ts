'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

const itemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(99),
})

const checkoutSchema = z.object({
  items: z.array(itemSchema).min(1),
  name: z.string().trim().min(2),
  street: z.string().trim().min(3),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  zip: z.string().trim().min(3),
  country: z.string().trim().default('US'),
})

export async function createCheckoutSession(input: z.infer<typeof checkoutSchema>) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sign in required' }

  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid checkout data' }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'Payments are not configured. Add STRIPE_SECRET_KEY to .env' }
  }

  const productIds = parsed.data.items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  })

  if (products.length !== productIds.length) {
    return { error: 'Some products are no longer available' }
  }

  let total = 0
  const lineItems: { price_data: StripeLineItem; quantity: number }[] = []
  const orderItems: { productId: string; quantity: number; price: number }[] = []

  for (const item of parsed.data.items) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return { error: 'Product not found' }
    const unitPrice = Number(product.price)
    total += unitPrice * item.quantity
    orderItems.push({ productId: product.id, quantity: item.quantity, price: unitPrice })
    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(unitPrice * 100),
        product_data: {
          name: product.name,
          images: product.images[0] ? [product.images[0]] : [],
        },
      },
    })
  }

  const orderNumber = `AUR-${Date.now()}`
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      total,
      status: 'PENDING',
      shippingAddress: {
        name: parsed.data.name,
        street: parsed.data.street,
        city: parsed.data.city,
        state: parsed.data.state,
        zip: parsed.data.zip,
        country: parsed.data.country,
      },
      items: {
        create: orderItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
  })

  const stripe = getStripe()
  const baseUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${baseUrl}/checkout/success?order=${order.orderNumber}`,
    cancel_url: `${baseUrl}/checkout?cancelled=1`,
    metadata: {
      orderId: order.id,
      userId: session.user.id,
    },
    customer_email: session.user.email ?? undefined,
  })

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentId: checkoutSession.id },
  })

  if (!checkoutSession.url) return { error: 'Could not create payment session' }
  return { url: checkoutSession.url }
}

type StripeLineItem = {
  currency: string
  unit_amount: number
  product_data: { name: string; images?: string[] }
}
