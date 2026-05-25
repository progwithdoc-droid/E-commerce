import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth.edge'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Customer protected routes → login with return URL
  if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
    if (!req.auth?.user) {
      const login = new URL('/login', req.nextUrl)
      login.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(login)
    }
  }

  // Admin dashboard (public login/register pages excluded)
  const isAdminPublic = pathname === '/admin/login' || pathname === '/admin/register'
  if (pathname.startsWith('/admin') && !isAdminPublic) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }
    if (req.auth.user.role !== 'ADMIN') {
      const login = new URL('/admin/login', req.nextUrl)
      login.searchParams.set('error', 'not_admin')
      return NextResponse.redirect(login)
    }
  }
})

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/checkout/:path*'],
}
