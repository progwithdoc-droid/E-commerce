import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

/** Edge-safe auth for middleware (no bcrypt / Prisma). */
export const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
})
