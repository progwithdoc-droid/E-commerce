'use server'

import { hash, compare } from 'bcryptjs'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().trim().min(6).max(100),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().trim().min(6),
})

const adminRegisterSchema = registerSchema.extend({
  adminSecret: z.string().trim().min(1),
})

export type RegisterState = {
  error?: string
  success?: boolean
}

export type LoginState = {
  error?: string
}

export async function registerUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Invalid form data. Check your inputs.' }
  }

  const { name, email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    return { error: 'An account with this email already exists.' }
  }

  const passwordHash = await hash(password, 12)

  await prisma.user.create({
    data: { name, email, password: passwordHash },
  })

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: 'Account created but sign-in failed. Please sign in manually.',
      }
    }
    throw error
  }

  redirect('/account')
}

export async function registerAdminUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const setupSecret = process.env.ADMIN_SETUP_SECRET
  if (!setupSecret) {
    return {
      error: 'Admin sign-up is disabled. Add ADMIN_SETUP_SECRET to your .env file.',
    }
  }

  const parsed = adminRegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    adminSecret: formData.get('adminSecret'),
  })

  if (!parsed.success) {
    return { error: 'Invalid form data. Check your inputs.' }
  }

  if (parsed.data.adminSecret !== setupSecret) {
    return { error: 'Invalid admin access code.' }
  }

  const { name, email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    return { error: 'An account with this email already exists.' }
  }

  const passwordHash = await hash(password, 12)

  await prisma.user.create({
    data: { name, email, password: passwordHash, role: 'ADMIN' },
  })

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: 'Admin account created but sign-in failed. Please sign in manually.',
      }
    }
    throw error
  }

  redirect('/admin')
}

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Invalid email or password.' }
  }

  const callbackUrl =
    String(formData.get('callbackUrl') ?? '/account') || '/account'

  if (callbackUrl.startsWith('/admin')) {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { password: true, role: true },
    })
    if (!user?.password) {
      return { error: 'Invalid email or password.' }
    }
    const passwordMatch = await compare(parsed.data.password, user.password)
    if (!passwordMatch) {
      return { error: 'Invalid email or password.' }
    }
    if (user.role !== 'ADMIN') {
      return { error: 'This account does not have admin access.' }
    }
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    throw error
  }

  redirect(callbackUrl)
}
