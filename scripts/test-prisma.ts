import { prisma } from '../lib/prisma'

async function main() {
  const [categories, products] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
  ])
  console.log('Prisma OK —', { categories, products })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
