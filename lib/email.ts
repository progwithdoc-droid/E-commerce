import { getResend } from '@/lib/resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Aurum Store <onboarding@resend.dev>'

export async function sendCustomerEmail(params: {
  to: string
  subject: string
  body: string
}) {
  const resend = getResend()
  if (!resend) {
    return { error: 'Email is not configured. Add RESEND_API_KEY to .env' }
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: params.subject,
    html: `<div style="font-family:sans-serif;line-height:1.6;color:#0A0A0A">${params.body.replace(/\n/g, '<br/>')}</div>`,
  })

  if (error) return { error: error.message }
  return { success: true as const }
}

async function sendHtmlEmail(params: {
  to: string
  subject: string
  html: string
}) {
  const resend = getResend()
  if (!resend) {
    return { error: 'Email is not configured. Add RESEND_API_KEY to .env' }
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })
  if (error) return { error: error.message }
  return { success: true as const }
}

export async function sendOrderConfirmation(params: {
  to: string
  customerName: string
  orderNumber: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
  shippingAddress: string
  orderUrl?: string
}) {
  const items = params.items
    .map(
      (item) =>
        `<tr><td style="padding:8px">${item.name}</td><td style="padding:8px;text-align:center">${item.quantity}</td><td style="padding:8px;text-align:right">$${(
          item.price * item.quantity
        ).toFixed(2)}</td></tr>`
    )
    .join('')
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A0A0A">
      <h1>Order confirmed — ${params.orderNumber}</h1>
      <p>Hi ${params.customerName}, your order is confirmed.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">${items}</table>
      <p><strong>Total:</strong> $${params.total.toFixed(2)}</p>
      <p><strong>Shipping:</strong> ${params.shippingAddress}</p>
      ${params.orderUrl ? `<p><a href="${params.orderUrl}">View order details</a></p>` : ''}
    </div>`
  return sendHtmlEmail({
    to: params.to,
    subject: `Order confirmation — ${params.orderNumber}`,
    html,
  })
}

export async function sendShippingUpdate(params: {
  to: string
  customerName: string
  orderNumber: string
  trackingNumber: string
  estimatedDelivery: string
}) {
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A0A0A">
      <h1>Your order has shipped</h1>
      <p>Hi ${params.customerName}, your order ${params.orderNumber} is on the way.</p>
      <p><strong>Tracking:</strong> ${params.trackingNumber}</p>
      <p><strong>Estimated delivery:</strong> ${params.estimatedDelivery}</p>
    </div>`
  return sendHtmlEmail({
    to: params.to,
    subject: `Shipping update — ${params.orderNumber}`,
    html,
  })
}

export async function sendWelcomeEmail(params: {
  to: string
  customerName: string
  shopUrl: string
}) {
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A0A0A">
      <h1>Welcome to AURUM</h1>
      <p>Hi ${params.customerName}, welcome to AURUM Store.</p>
      <p>Discover curated pieces designed for those who know.</p>
      <p><a href="${params.shopUrl}">Shop the latest collection</a></p>
    </div>`
  return sendHtmlEmail({
    to: params.to,
    subject: 'Welcome to AURUM Store',
    html,
  })
}

export async function sendPasswordReset(params: {
  to: string
  customerName: string
  resetUrl: string
  expiresInHours?: number
}) {
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A0A0A">
      <h1>Reset your password</h1>
      <p>Hi ${params.customerName}, click below to reset your password.</p>
      <p><a href="${params.resetUrl}">Reset password</a></p>
      <p>This link expires in ${params.expiresInHours ?? 1} hour(s).</p>
    </div>`
  return sendHtmlEmail({
    to: params.to,
    subject: 'Reset your AURUM password',
    html,
  })
}
