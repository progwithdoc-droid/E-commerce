import type { Metadata } from "next"
import { Cormorant_Garamond, Bebas_Neue, Inter } from "next/font/google"
import "./globals.css"
import { SmoothScroll } from "./components/SmoothScroll"
import { CustomCursor } from "./components/CustomCursor"
import { CartDrawer } from "./components/CartDrawer"
import { SessionProvider } from "./components/providers/SessionProvider"
import { Preloader } from "./components/Preloader"
import { SuppressWalletExtensionErrors } from "./components/SuppressWalletExtensionErrors"
import { Toaster } from "sonner"

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
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "AURUM STORE — Luxury Fashion & Lifestyle",
    description: "Designed for those who know. Premium apparel and accessories.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${bebas.variable} ${inter.variable}`}>
      <body className="bg-void text-cream overflow-x-hidden">
        <SuppressWalletExtensionErrors />
        <SessionProvider>
          <SmoothScroll>
            <Preloader />
            <CustomCursor />
            <CartDrawer />
            {children}
            <Toaster
              position="bottom-right"
              theme="dark"
              toastOptions={{
                style: {
                  background: '#0D0D0D',
                  border: '1px solid rgba(245,240,232,0.15)',
                  color: '#F5F0E8',
                },
              }}
            />
          </SmoothScroll>
        </SessionProvider>
      </body>
    </html>
  )
}