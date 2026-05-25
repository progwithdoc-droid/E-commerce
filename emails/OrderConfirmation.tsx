import React from 'react'

export function OrderConfirmationEmail(props: {
  customerName: string
  orderNumber: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
  shippingAddress: string
  orderUrl?: string
}) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#0A0A0A', lineHeight: 1.6 }}>
      <h1>Order confirmed — {props.orderNumber}</h1>
      <p>Hi {props.customerName}, your order is confirmed.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Item</th>
            <th style={{ textAlign: 'center', borderBottom: '1px solid #ddd', padding: 8 }}>Qty</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {props.items.map((item) => (
            <tr key={item.name}>
              <td style={{ padding: 8 }}>{item.name}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: 8 }}>
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Total:</strong> ${props.total.toFixed(2)}
      </p>
      <p>
        <strong>Shipping:</strong> {props.shippingAddress}
      </p>
      {props.orderUrl ? (
        <p>
          <a href={props.orderUrl}>View order details</a>
        </p>
      ) : null}
    </div>
  )
}
