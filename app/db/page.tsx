import { getDb } from '@/lib/db'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getDbInfo() {
  const sql = getDb()
  const [versionRow] = await sql`SELECT version()`
  const [categories, products, users] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.user.count(),
  ])
  return {
    version: versionRow.version as string,
    categories,
    products,
    users,
  }
}

export default async function DbPage() {
  let info: Awaited<ReturnType<typeof getDbInfo>> | null = null
  let error: string | null = null

  try {
    info = await getDbInfo()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Connection failed'
  }

  return (
    <main className="min-h-screen bg-void text-cream p-12 font-body">
      <h1 className="text-lg tracking-[0.2em] uppercase mb-6">Database</h1>
      {error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <div className="space-y-4 text-sm text-cream/80">
          <p className="font-mono text-xs leading-relaxed">{info?.version}</p>
          <p>
            Prisma: {info?.categories} categories, {info?.products} products,{' '}
            {info?.users} users
          </p>
          <p className="text-cream/50">
            Run <code className="text-cream/70">npm run db:migrate</code> if counts are 0.
          </p>
        </div>
      )}
    </main>
  )
}
