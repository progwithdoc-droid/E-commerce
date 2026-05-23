import { z } from 'zod'
import { getDatabaseUrl } from './db'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().url(),
})

export const env = envSchema.parse({
  DATABASE_URL: getDatabaseUrl(),
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL ?? 'http://localhost:3000',
})
