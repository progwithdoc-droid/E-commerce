import React from 'react'

export function PasswordResetEmail(props: {
  customerName: string
  resetUrl: string
  expiresInHours?: number
}) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#0A0A0A', lineHeight: 1.6 }}>
      <h1>Reset your password</h1>
      <p>Hi {props.customerName}, click below to reset your password.</p>
      <p>
        <a href={props.resetUrl}>Reset password</a>
      </p>
      <p>This link expires in {props.expiresInHours ?? 1} hour(s).</p>
    </div>
  )
}
