import { Navigation } from '@/app/components/Navigation'
import { Footer } from '@/app/sections/Footer'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
