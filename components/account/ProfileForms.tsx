'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { updateProfile, changePassword } from '@/app/actions/account'

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-electric text-void rounded-full text-[11px] font-body tracking-[0.15em] uppercase font-semibold disabled:opacity-50"
    >
      {pending ? 'Saving...' : label}
    </button>
  )
}

type ActionState = { error?: string; success?: boolean }

export function ProfileForms({
  name,
  hasPassword,
}: {
  name: string | null
  hasPassword: boolean
}) {
  const [profileState, profileAction] = useFormState(updateProfile, {} as ActionState)
  const [passState, passAction] = useFormState(changePassword, {} as ActionState)

  useEffect(() => {
    if (profileState.success) toast.success('Profile updated')
    if (profileState.error) toast.error(profileState.error)
  }, [profileState])

  useEffect(() => {
    if (passState.success) toast.success('Password updated')
    if (passState.error) toast.error(passState.error)
  }, [passState])

  return (
    <div className="space-y-10">
      <section className="border border-cream/10 rounded-xl p-6 bg-surface/30">
        <h2 className="font-display text-2xl text-cream mb-6">Personal details</h2>
        <form action={profileAction} className="space-y-4 max-w-md">
          <input
            name="name"
            defaultValue={name ?? ''}
            placeholder="Full name"
            required
            className="w-full bg-void border border-cream/15 rounded-lg px-4 py-3 text-sm text-cream"
          />
          <Submit label="Save profile" />
        </form>
      </section>

      {hasPassword && (
        <section className="border border-cream/10 rounded-xl p-6 bg-surface/30">
          <h2 className="font-display text-2xl text-cream mb-6">Change password</h2>
          <form action={passAction} className="space-y-4 max-w-md">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              required
              className="w-full bg-void border border-cream/15 rounded-lg px-4 py-3 text-sm text-cream"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              required
              minLength={6}
              className="w-full bg-void border border-cream/15 rounded-lg px-4 py-3 text-sm text-cream"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              minLength={6}
              className="w-full bg-void border border-cream/15 rounded-lg px-4 py-3 text-sm text-cream"
            />
            <Submit label="Update password" />
          </form>
        </section>
      )}
    </div>
  )
}
