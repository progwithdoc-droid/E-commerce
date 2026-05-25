import React from 'react'

export function WelcomeEmail(props: { customerName: string; shopUrl: string }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#0A0A0A', lineHeight: 1.6 }}>
      <h1>Welcome to AURUM</h1>
      <p>Hi {props.customerName}, welcome to AURUM Store.</p>
      <p>Discover curated pieces designed for those who know.</p>
      <p>
        <a href={props.shopUrl}>Shop the latest collection</a>
      </p>
    </div>
  )
}
