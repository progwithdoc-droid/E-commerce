"use client"

export function Footer() {
  const shopLinks = [
    "Collections",
    "New Arrivals",
    "Sale",
    "Lookbook",
    "Gift Cards",
  ]
  const companyLinks = ["About", "Sustainability", "Careers", "Journal", "Press"]
  const supportLinks = ["FAQ", "Shipping", "Returns", "Contact", "Size Guide"]

  return (
    <footer className="w-full bg-[#0A0A0A]">
      {/* Hairline */}
      <div className="w-full h-px bg-cream/10" />

      <div className="px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-body text-[13px] tracking-[0.18em] uppercase text-cream">
                AURUM
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="opacity-60"
              >
                <path
                  d="M6 0L12 6L6 12L0 6L6 0Z"
                  stroke="#F5F0E8"
                  strokeWidth="0.8"
                  fill="none"
                />
              </svg>
            </div>
            <p className="font-body text-xs text-cream/40 mb-6">
              Designed for those who know.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {["Instagram", "X", "Pinterest", "TikTok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-cream/40 hover:text-cream transition-opacity"
                  aria-label={social}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social === "Instagram" && (
                      <>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </>
                    )}
                    {social === "X" && (
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                    )}
                    {social === "Pinterest" && (
                      <>
                        <line x1="12" y1="8" x2="12" y2="21" />
                        <path d="M5 12.5C5 12.5 6.5 11 9 11C12 11 13 14 13 16C13 18 11.5 20 9 20C6.5 20 5 17.5 5 15.5C5 13.5 7 10 12 8" />
                      </>
                    )}
                    {social === "TikTok" && (
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h3 className="font-body text-[13px] tracking-[0.15em] uppercase text-cream mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-[13px] text-cream/50 hover:text-cream transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h3 className="font-body text-[13px] tracking-[0.15em] uppercase text-cream mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-[13px] text-cream/50 hover:text-cream transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h3 className="font-body text-[13px] tracking-[0.15em] uppercase text-cream mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-[13px] text-cream/50 hover:text-cream transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="px-6 lg:px-12 py-6 border-t border-cream/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-[11px] text-cream/30">
          © 2025 AURUM STORE. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Privacy Policy", "Terms", "Cookies"].map((link, i) => (
            <span key={link} className="flex items-center gap-4">
              <a
                href="#"
                className="font-body text-[11px] text-cream/30 hover:text-cream/50 transition-colors"
              >
                {link}
              </a>
              {i < 2 && <span className="text-cream/10">·</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}