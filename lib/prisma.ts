import { PrismaClient } from '@prisma/client'
import { getDatabaseUrl } from './db'

/** Neon free tier can sleep; ensure a long enough connect timeout for cold starts. */
function getPrismaDatabaseUrl() {
  const raw = getDatabaseUrl()
  if (!raw) {
    throw new Error(
      'DATABASE_URL is not set. Copy the pooled connection string from Neon → Connect.'
    )
  }

  try {
    const url = new URL(raw)
    // channel_binding=require often breaks Prisma on Windows
    url.searchParams.delete('channel_binding')
    if (!url.searchParams.has('connect_timeout')) {
      url.searchParams.set('connect_timeout', '30')
    }
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require')
    }
    return url.toString()
  } catch {
    return raw
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: getPrismaDatabaseUrl() },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
