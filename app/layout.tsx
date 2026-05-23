import type { Metadata } from "next"
import { Cormorant_Garamond, Bebas_Neue, Inter } from "next/font/google"
import "./globals.css"
import { SmoothScroll } from "./components/SmoothScroll"
import { CustomCursor } from "./components/CustomCursor"
import { CartDrawer } from "./components/CartDrawer"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
})

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AURUM STORE — Luxury Fashion & Lifestyle",
  description: "Designed for those who know. Premium apparel and accessories.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${bebas.variable} ${inter.variable}`}>
      <body className="bg-void text-cream overflow-x-hidden">
        <SmoothScroll>
          <CustomCursor />
          <CartDrawer />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}