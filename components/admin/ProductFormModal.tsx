'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/app/actions/product.actions'
import { UploadButton } from '@/lib/uploadthing-client'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z.union([z.coerce.number().positive(), z.literal('')]).optional(),
  stock: z.coerce.number().int().min(0),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  images: z.string().min(1, 'Add at least one image URL'),
})

type FormValues = z.infer<typeof schema>

type Category = { id: string; name: string }

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
}

export function ProductFormModal({
  open,
  onClose,
  categories,
  product,
}: {
  open: boolean
  onClose: () => void
  categories: Category[]
  product?: Product | null
}) {
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      comparePrice: '',
      stock: 0,
      sku: '',
      categoryId: '',
      images: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (product) {
      const imgs = product.images.join(', ')
      setImageUrls(product.images)
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : '',
        stock: product.stock,
        sku: product.sku ?? '',
        categoryId: product.categoryId ?? '',
        images: imgs,
      })
    } else {
      setImageUrls([])
      reset({
        name: '',
        slug: '',
        description: '',
        price: 0,
        comparePrice: '',
        stock: 0,
        sku: '',
        categoryId: '',
        images: '',
      })
    }
  }, [open, product, reset])

  useEffect(() => {
    const joined = imageUrls.join(', ')
    setValue('images', joined)
  }, [imageUrls, setValue])

  if (!open) return null

  async function onSubmit(data: FormValues) {
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      toast.error('Please fix form errors')
      return
    }
    const payload = {
      ...parsed.data,
      comparePrice: parsed.data.comparePrice ?? '',
      images: imageUrls.length ? imageUrls.join(', ') : parsed.data.images,
    }
    const res = product
      ? await updateProduct(product.id, payload)
      : await createProduct(payload)
    if (res.error) toast.error(res.error)
    else {
      toast.success(product ? 'Product updated' : 'Product created')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto border border-cream/15 rounded-xl bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-cream">
            {product ? 'Edit product' : 'Add product'}
          </h2>
          <button type="button" onClick={onClose} className="text-cream/50 hover:text-cream">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-cream/50">Name</label>
            <input className="input-field mt-1" {...register('name')} />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-cream/50">Slug</label>
            <input className="input-field mt-1" placeholder="auto-generated" {...register('slug')} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-cream/50">Description</label>
            <textarea className="input-field mt-1 min-h-[80px]" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cream/50">Price</label>
              <input type="number" step="0.01" className="input-field mt-1" {...register('price')} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cream/50">Compare</label>
              <input type="number" step="0.01" className="input-field mt-1" {...register('comparePrice')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cream/50">Stock</label>
              <input type="number" className="input-field mt-1" {...register('stock')} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cream/50">SKU</label>
              <input className="input-field mt-1" {...register('sku')} />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-cream/50">Category</label>
            <select className="input-field mt-1" {...register('categoryId')}>
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-cream/50">Images</label>
            <input
              className="input-field mt-1 text-xs"
              placeholder="https://... (comma separated)"
              {...register('images')}
              onChange={(e) => {
                register('images').onChange(e)
                setImageUrls(
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }}
            />
            {errors.images && <p className="text-xs text-red-400 mt-1">{errors.images.message}</p>}
            <div className="mt-2">
              <UploadButton
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  const urls = res.map((f) => f.url)
                  setImageUrls((prev) => {
                    const next = [...prev, ...urls]
                    setValue('images', next.join(', '))
                    return next
                  })
                  toast.success('Images uploaded')
                }}
                onUploadError={(e) => {
                  toast.error(e.message)
                }}
                appearance={{
                  button:
                    'bg-electric/20 text-electric text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg ut-ready:bg-electric/20',
                  allowedContent: 'text-cream/40 text-xs',
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-cream text-void rounded-lg text-[11px] uppercase tracking-widest font-body hover:bg-electric transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : product ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  )
}
