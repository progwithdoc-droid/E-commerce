'use client'

import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { sendCustomerEmailAction } from '@/app/actions/admin'

type Customer = { id: string; name: string | null; email: string }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-cream text-void rounded-lg text-[11px] uppercase tracking-widest disabled:opacity-50"
    >
      {pending ? 'Sending…' : 'Send email'}
    </button>
  )
}

export function EmailComposeModal({
  customer,
  onClose,
}: {
  customer: Customer | null
  onClose: () => void
}) {
  const [state, formAction] = useFormState(sendCustomerEmailAction, null)

  useEffect(() => {
    if (!state) return
    if ('error' in state && state.error) toast.error(state.error)
    if ('success' in state && state.success) {
      toast.success('Email sent')
      onClose()
    }
  }, [state, onClose])

  if (!customer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative w-full max-w-md border border-cream/15 rounded-xl bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-cream">Email {customer.name ?? customer.email}</h2>
          <button type="button" onClick={onClose} className="text-cream/50">
            <X size={18} />
          </button>
        </div>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="customerId" value={customer.id} />
          <div>
            <label className="text-[10px] uppercase tracking-widest text-cream/50">Subject</label>
            <input name="subject" required className="input-field mt-1" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-cream/50">Message</label>
            <textarea name="body" required rows={6} className="input-field mt-1" />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
