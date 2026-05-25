import React from 'react'

export function ShippingUpdateEmail(props: {
  customerName: string
  orderNumber: string
  trackingNumber: string
  estimatedDelivery: string
}) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#0A0A0A', lineHeight: 1.6 }}>
      <h1>Your order has shipped</h1>
      <p>Hi {props.customerName}, your order {props.orderNumber} is on the way.</p>
      <p>
        <strong>Tracking:</strong> {props.trackingNumber}
      </p>
      <p>
        <strong>Estimated delivery:</strong> {props.estimatedDelivery}
      </p>
    </div>
  )
}
