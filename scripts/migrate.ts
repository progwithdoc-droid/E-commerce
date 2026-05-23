import { readFileSync } from 'fs'
import { join } from 'path'
import { neon, Pool } from '@neondatabase/serverless'

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  )
}

async function main() {
  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    throw new Error(
      'Set DATABASE_URL in .env (copy from Neon dashboard → Connect)'
    )
  }

  const schemaPath = join(process.cwd(), 'db', 'schema.sql')
  const schema = readFileSync(schemaPath, 'utf8')

  const pool = new Pool({ connectionString: databaseUrl })
  await pool.query(schema)
  await pool.end()

  console.log('✓ Schema applied from db/schema.sql')

  const sql = neon(databaseUrl)

  // Seed categories + products from storefront catalog
  const categories = [
    { name: 'Outerwear', slug: 'outerwear' },
    { name: 'Tops', slug: 'tops' },
    { name: 'Footwear', slug: 'footwear' },
    { name: 'Accessories', slug: 'accessories' },
  ]

  for (const cat of categories) {
    await sql`
      INSERT INTO categories (name, slug)
      VALUES (${cat.name}, ${cat.slug})
      ON CONFLICT (slug) DO NOTHING
    `
  }

  const products = [
    { name: 'Obsidian Bomber Jacket', slug: 'obsidian-bomber-jacket', price: 580, compare: 720, category: 'outerwear', image: 'https://images.unsplash.com/photo-1551028711-00167b16eac5?w=800' },
    { name: 'Merino Wool Turtleneck', slug: 'merino-wool-turtleneck', price: 340, compare: null, category: 'tops', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800' },
    { name: 'Structured Overcoat', slug: 'structured-overcoat', price: 890, compare: null, category: 'outerwear', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800' },
    { name: 'Canvas Field Jacket', slug: 'canvas-field-jacket', price: 460, compare: 520, category: 'outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' },
    { name: 'Red Runner Sneakers', slug: 'red-runner-sneakers', price: 320, compare: null, category: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
    { name: 'Leather Crossbody', slug: 'leather-crossbody', price: 420, compare: null, category: 'accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800' },
    { name: 'Cashmere Scarf', slug: 'cashmere-scarf', price: 180, compare: null, category: 'accessories', image: 'https://images.unsplash.com/photo-1520903920245-00c87247adb1?w=800' },
    { name: 'Tactical Backpack', slug: 'tactical-backpack', price: 280, compare: null, category: 'accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  ]

  for (const p of products) {
    await sql`
      INSERT INTO products (name, slug, price, compare_price, images, stock, category_id)
      VALUES (
        ${p.name},
        ${p.slug},
        ${p.price},
        ${p.compare},
        ARRAY[${p.image}]::text[],
        10,
        (SELECT id FROM categories WHERE slug = ${p.category} LIMIT 1)
      )
      ON CONFLICT (slug) DO UPDATE SET
        price = EXCLUDED.price,
        compare_price = EXCLUDED.compare_price,
        images = EXCLUDED.images
    `
  }

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM products`
  console.log('✓ Seed complete:', count, 'products in database')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
