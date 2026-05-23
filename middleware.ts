import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth.edge'

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
})

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/checkout/:path*'],
}
