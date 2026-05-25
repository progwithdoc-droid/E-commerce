"use client"

import Link from "next/link"

const footerLinks = {
  shop: [
    { label: "Collections", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Lookbook", href: "/#lookbook" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
  ],
  support: [
    { label: "Contact", href: "/about" },
    { label: "Shipping", href: "/about" },
    { label: "Returns", href: "/about" },
  ],
}

export function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0A]">
      <div className="w-full h-px bg-cream/10" />

      <div className="px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-body text-[13px] tracking-[0.18em] uppercase text-cream">
                AURUM
              </span>
            </Link>
            <p className="font-body text-xs text-cream/40 mb-6">
              Designed for those who know.
            </p>
          </div>

          <div>
            <h3 className="font-body text-[13px] tracking-[0.15em] uppercase text-cream mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-[13px] text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body text-[13px] tracking-[0.15em] uppercase text-cream mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-[13px] text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body text-[13px] tracking-[0.15em] uppercase text-cream mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-[13px] text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-12 py-6 border-t border-cream/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-[11px] text-cream/30">
          © 2025 AURUM STORE. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
