'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useMounted } from '@/app/hooks/useMounted'

export function SignInButton() {
  const mounted = useMounted()
  const { data: session, status } = useSession()

  if (!mounted) {
    return (
      <span
        className="hidden sm:inline-block w-[140px] h-[30px]"
        aria-hidden
      />
    )
  }

  if (status === 'loading') {
    return (
      <span className="hidden sm:inline-block w-[140px] h-[30px]" aria-hidden />
    )
  }

  if (session?.user) {
    return (
      <div className="hidden sm:flex items-center gap-3">
        <Link
          href="/account"
          className="text-[11px] font-body tracking-[0.18em] uppercase text-cream/70 hover:text-cream transition-colors"
        >
          Account
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="inline-flex items-center px-4 py-1.5 border border-cream/20 rounded-full text-[11px] font-body tracking-[0.18em] uppercase text-cream/70 hover:border-cream/50 hover:text-cream transition-all"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="hidden sm:inline-flex items-center px-4 py-1.5 border border-cream/20 rounded-full text-[11px] font-body tracking-[0.18em] uppercase text-cream/70 hover:border-cream/50 hover:text-cream transition-all"
    >
      Sign In
    </Link>
  )
}
