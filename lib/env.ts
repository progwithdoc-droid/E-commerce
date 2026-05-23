import { z } from 'zod'
import { getDatabaseUrl } from './db'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
})

export const env = envSchema.parse({
  DATABASE_URL: getDatabaseUrl(),
})
