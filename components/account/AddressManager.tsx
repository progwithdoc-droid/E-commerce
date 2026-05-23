'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { createAddress, deleteAddress } from '@/app/actions/account'

type Address = {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

function AddSubmit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-electric text-void rounded-full text-[11px] font-body tracking-[0.15em] uppercase font-semibold disabled:opacity-50"
    >
      {pending ? 'Adding...' : 'Add address'}
    </button>
  )
}

type ActionState = { error?: string; success?: boolean }

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const [state, action] = useFormState(createAddress, {} as ActionState)

  useEffect(() => {
    if (state.success) toast.success('Address added')
    if (state.error) toast.error(state.error)
  }, [state])

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <p className="text-cream/50 text-sm font-body">No saved addresses yet.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-cream/10 rounded-xl p-5 bg-surface/30 flex justify-between gap-4"
            >
              <div>
                {addr.isDefault && (
                  <span className="text-[10px] uppercase tracking-widest text-electric mb-2 block">
                    Default
                  </span>
                )}
                <p className="font-body text-cream text-sm">{addr.name}</p>
                <p className="font-body text-cream/60 text-sm mt-1">
                  {addr.street}, {addr.city}, {addr.state} {addr.zip}
                </p>
                <p className="font-body text-cream/40 text-xs">{addr.country}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await deleteAddress(addr.id)
                  toast.success('Address removed')
                }}
                className="text-xs text-cream/40 hover:text-red-300 uppercase tracking-wider h-fit"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <form action={action} className="border border-cream/10 rounded-xl p-6 bg-surface/30 space-y-4 max-w-lg">
        <h3 className="font-display text-xl text-cream">Add new address</h3>
        <input name="name" placeholder="Full name" required className="input-field" />
        <input name="street" placeholder="Street" required className="input-field" />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" placeholder="City" required className="input-field" />
          <input name="state" placeholder="State" required className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="zip" placeholder="ZIP" required className="input-field" />
          <input name="country" placeholder="Country" defaultValue="US" className="input-field" />
        </div>
        <label className="flex items-center gap-2 text-sm text-cream/60 font-body">
          <input type="checkbox" name="isDefault" className="rounded" />
          Set as default
        </label>
        <AddSubmit />
      </form>
    </div>
  )
}
