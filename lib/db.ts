import { neon } from '@neondatabase/serverless'

export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  )
}

export function getDb() {
  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Copy the pooled connection string from Neon → Connect.'
    )
  }
  return neon(databaseUrl)
}
