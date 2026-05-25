'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ProductFormModal } from '@/components/admin/ProductFormModal'
import { deleteProduct } from '@/app/actions/product.actions'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: { toString(): string }
  comparePrice: { toString(): string } | null
  stock: number
  sku: string | null
  categoryId: string | null
  images: string[]
  category: { name: string } | null
}

type Category = { id: string; name: string }

const columnHelper = createColumnHelper<Product>()

export function ProductsTable({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const [search, setSearch] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="rounded border-cream/30"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-cream/30"
          />
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Product',
        cell: (info) => {
          const p = info.row.original
          return (
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-12 rounded bg-cream/5 overflow-hidden shrink-0">
                {p.images[0] ? (
                  <Image src={p.images[0]} alt="" fill className="object-cover" sizes="40px" />
                ) : null}
              </div>
              <div>
                <Link
                  href={`/admin/products/${p.id}`}
                  className="text-cream hover:text-electric text-sm"
                >
                  {p.name}
                </Link>
                <p className="text-xs text-cream/40 font-mono">{p.slug}</p>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor((r) => r.category?.name ?? '—', { id: 'category', header: 'Category' }),
      columnHelper.accessor('stock', { header: 'Stock' }),
      columnHelper.accessor((r) => `$${Number(r.price).toFixed(2)}`, {
        id: 'price',
        header: 'Price',
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={async () => {
              if (!confirm('Delete this product?')) return
              const res = await deleteProduct(row.original.id)
              if (res.error) toast.error(res.error)
              else toast.success('Deleted')
            }}
            className="p-2 text-cream/40 hover:text-red-400"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data: products,
    columns,
    state: { rowSelection, globalFilter: search },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="input-field max-w-xs"
        />
        <button
          type="button"
          onClick={() => {
            setEditProduct(null)
            setModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-electric text-void rounded-lg text-[10px] uppercase tracking-widest font-body"
        >
          <Plus size={14} />
          Add product
        </button>
      </div>

      <div className="border border-cream/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-cream/10 text-cream/50 text-[10px] uppercase tracking-widest">
                {hg.headers.map((h) => (
                  <th key={h.id} className="p-4 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-cream/5 hover:bg-cream/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        product={editProduct}
      />
    </div>
  )
}
