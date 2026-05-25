import type { NextAuthConfig } from 'next-auth'
import type { UserRole } from '@/types'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

const providers: NextAuthConfig['providers'] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  )
}

export const authConfig = {
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized() {
      // Route protection handled entirely in middleware.ts with correct redirects
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user.role ?? 'CUSTOMER') as UserRole
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
} satisfies NextAuthConfig
