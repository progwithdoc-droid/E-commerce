"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ShoppingBag } from "lucide-react"
import { useCart } from "../store/cart"
import { CartCountBadge } from "./auth/CartCountBadge"
import { SignInButton } from "./auth/SignInButton"
import { AdminNavLinks } from "./auth/AdminNavLinks"
import { SearchModal } from "@/components/home/SearchModal"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const toggleCart = useCart((s) => s.toggleCart)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const navLinks = [
    { label: "Collections", href: "/products" },
    { label: "Lookbook", href: "/#lookbook" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-void/80 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-body text-[13px] tracking-[0.18em] uppercase text-cream">
              AURUM
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="opacity-60 group-hover:opacity-100 transition-opacity"
            >
              <path
                d="M6 0L12 6L6 12L0 6L6 0Z"
                stroke="#F5F0E8"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative font-body text-[13px] tracking-[0.18em] uppercase text-cream/70 hover:text-cream transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cream group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-cream/70 hover:text-cream transition-colors"
              aria-label="Search products"
            >
              <Search size={18} strokeWidth={1.2} />
            </button>
            <button
              type="button"
              onClick={toggleCart}
              className="relative text-cream/70 hover:text-cream transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} strokeWidth={1.2} />
              <CartCountBadge />
            </button>
            <AdminNavLinks />
            <SignInButton />
          </div>
        </div>
      </motion.header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
