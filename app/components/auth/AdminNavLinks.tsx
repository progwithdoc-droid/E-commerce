'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Shield } from 'lucide-react'
import { useMounted } from '@/app/hooks/useMounted'

const btnClass =
  'inline-flex items-center gap-1.5 px-3 py-1.5 border border-cream/20 rounded-full text-[10px] font-body tracking-[0.16em] uppercase text-cream/70 hover:border-electric/50 hover:text-electric transition-all'

export function AdminNavLinks() {
  const mounted = useMounted()
  const { data: session, status } = useSession()

  if (!mounted || status === 'loading') {
    return <span className="hidden sm:inline-block w-[200px] h-[30px]" aria-hidden />
  }

  if (session?.user?.role === 'ADMIN') {
    return (
      <Link href="/admin" className={btnClass} data-cursor="hover">
        <Shield size={12} strokeWidth={1.5} />
        Admin
      </Link>
    )
  }

  return (
    <div className="hidden sm:flex items-center gap-2">
      <Link href="/admin/login" className={btnClass} data-cursor="hover">
        <Shield size={12} strokeWidth={1.5} />
        Admin Login
      </Link>
      <Link
        href="/admin/register"
        className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-body tracking-[0.16em] uppercase text-cream/50 hover:text-electric transition-colors"
      >
        Admin Sign Up
      </Link>
    </div>
  )
}
