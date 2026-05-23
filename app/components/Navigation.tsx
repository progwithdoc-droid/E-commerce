"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingBag } from "lucide-react"
import { useCart } from "../store/cart"
import { SignInButton } from "./auth/SignInButton"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const toggleCart = useCart((s) => s.toggleCart)
  const totalItems = useCart((s) => s.totalItems())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Collections", href: "#collections" },
    { label: "Lookbook", href: "#lookbook" },
    { label: "About", href: "#about" },
    { label: "Journal", href: "#journal" },
  ]

  return (
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
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-2 group">
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
        </a>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative font-body text-[13px] tracking-[0.18em] uppercase text-cream/70 hover:text-cream transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-cream group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          <button className="text-cream/70 hover:text-cream transition-colors">
            <Search size={18} strokeWidth={1.2} />
          </button>
          <button
            onClick={toggleCart}
            className="relative text-cream/70 hover:text-cream transition-colors"
          >
            <ShoppingBag size={18} strokeWidth={1.2} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-electric text-void text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <SignInButton />
        </div>
      </div>
    </motion.header>
  )
}