import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),
  password: z.string().trim().min(6),
})

export const credentialsProvider = Credentials({
  id: 'credentials',
  name: 'Email and Password',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    const parsed = credentialsSchema.safeParse(credentials)
    if (!parsed.success) return null

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user?.password) return null
    if (user.role === 'SUSPENDED') return null

    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role as 'CUSTOMER' | 'ADMIN',
    }
  },
})
