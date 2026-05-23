'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  User,
  MapPin,
  Heart,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
]

export function AccountSidebar({ userName, userEmail }: { userName?: string | null; userEmail?: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="space-y-8">
      <div className="border border-cream/10 rounded-xl p-5 bg-surface/50">
        <p className="text-[10px] tracking-[0.25em] uppercase text-electric mb-2">Member</p>
        <p className="font-display text-xl text-cream">{userName ?? 'Guest'}</p>
        <p className="text-xs text-cream/50 font-body mt-1 truncate">{userEmail}</p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-all ${
                active
                  ? 'bg-cream/10 text-cream border border-cream/15'
                  : 'text-cream/55 hover:text-cream hover:bg-cream/5'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-cream/55 hover:text-red-300 hover:bg-red-500/10 transition-all mt-4"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </nav>
    </aside>
  )
}
