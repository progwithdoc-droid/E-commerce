import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getDbInfo() {
  const sql = getDb()
  const [versionRow] = await sql`SELECT version()`
  const [counts] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM categories) AS categories,
      (SELECT COUNT(*)::int FROM products) AS products
  `
  return {
    version: versionRow.version as string,
    categories: counts?.categories ?? 0,
    products: counts?.products ?? 0,
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
            Catalog: {info?.categories} categories, {info?.products} products
          </p>
          <p className="text-cream/50">
            Run <code className="text-cream/70">npm run db:migrate</code> if counts are 0.
          </p>
        </div>
      )}
    </main>
  )
}
