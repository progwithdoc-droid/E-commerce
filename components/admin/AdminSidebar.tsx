'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Menu,
  X,
  LogOut,
  Store,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
]

export function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <>
      <div className="flex items-center justify-between lg:block">
        <Link href="/admin" className="block" onClick={() => setOpen(false)}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-electric">Aurum</p>
          <p className="font-display text-2xl text-cream">Admin</p>
        </Link>
        <button
          type="button"
          className="lg:hidden p-2 text-cream/60"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-xs text-cream/40 font-body truncate mt-4 hidden lg:block">{email}</p>

      <nav className="flex flex-col gap-1 mt-8">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-all ${
                active
                  ? 'bg-electric/10 text-electric border border-electric/25'
                  : 'text-cream/55 hover:text-cream hover:bg-cream/5'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-cream/55 hover:text-cream hover:bg-cream/5 mt-2"
        >
          <Store size={16} strokeWidth={1.5} />
          View store
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-cream/55 hover:text-red-300 hover:bg-red-500/10 mt-2"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </nav>
    </>
  )

  return (
    <>
      <div className="lg:hidden flex items-center justify-between mb-6">
        <p className="font-display text-xl text-cream">Admin</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 border border-cream/15 rounded-lg text-cream/70"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-surface border-r border-cream/10 p-6 transform transition-transform lg:translate-x-0 lg:static lg:z-auto lg:h-auto lg:w-auto lg:bg-transparent lg:border-0 lg:p-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {nav}
      </aside>
    </>
  )
}
