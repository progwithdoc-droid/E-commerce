import { Suspense } from 'react'

// Fetch from Neon at request time — avoids build failing when DATABASE_URL is missing on Vercel
export const dynamic = 'force-dynamic'
import { Hero } from '@/app/sections/Hero'
import { FeaturedCategories } from '@/app/sections/FeaturedCategories'
import { HeroProductDrop } from '@/app/sections/HeroProductDrop'
import { LookbookTeaser } from '@/app/sections/LookbookTeaser'
import { TrustStrip } from '@/app/sections/TrustStrip'
import { Testimonials } from '@/app/sections/Testimonials'
import { Newsletter } from '@/app/sections/Newsletter'
import { getFeaturedProducts, getCategories } from '@/app/actions/products'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryGrid } from '@/components/home/CategoryGrid'

function ProductsSkeleton() {
  return (
    <div className="w-full bg-surface py-24 px-6 lg:px-12 animate-pulse">
      <div className="h-12 w-64 bg-cream/10 rounded mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-cream/5 rounded" />
        ))}
      </div>
    </div>
  )
}

async function FeaturedSection() {
  const products = await getFeaturedProducts(8)
  return <FeaturedProducts products={products} />
}

async function CategoriesSection() {
  const categories = await getCategories()
  return <CategoryGrid categories={categories} />
}

export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <Suspense fallback={<div className="h-48 bg-void animate-pulse" />}>
        <CategoriesSection />
      </Suspense>
      <FeaturedCategories />
      <HeroProductDrop />
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <LookbookTeaser />
      <TrustStrip />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
