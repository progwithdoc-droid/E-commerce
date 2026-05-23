"use client"

import { Hero } from "./sections/Hero"
import { FeaturedCategories } from "./sections/FeaturedCategories"
import { HeroProductDrop } from "./sections/HeroProductDrop"
import { ProductGrid } from "./sections/ProductGrid"
import { LookbookTeaser } from "./sections/LookbookTeaser"
import { TrustStrip } from "./sections/TrustStrip"
import { Testimonials } from "./sections/Testimonials"
import { Newsletter } from "./sections/Newsletter"
import { Footer } from "./sections/Footer"
import { Navigation } from "./components/Navigation"

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <FeaturedCategories />
      <HeroProductDrop />
      <ProductGrid />
      <LookbookTeaser />
      <TrustStrip />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  )
}