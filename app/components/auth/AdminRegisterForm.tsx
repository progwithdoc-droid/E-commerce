'use client'

import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { registerAdminUser, type RegisterState } from '@/app/actions/auth'

const initialState: RegisterState = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-electric text-void rounded-full text-[11px] font-body tracking-[0.18em] uppercase font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? 'Creating account...' : 'Create admin account'}
    </button>
  )
}

export function AdminRegisterForm() {
  const [state, formAction] = useFormState(registerAdminUser, initialState)

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-electric">Aurum</p>
        <h1 className="font-display text-4xl tracking-wide text-cream">Admin Sign Up</h1>
        <p className="text-sm text-cream/60 font-body">
          Create an admin account with your access code
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && (
          <p className="text-sm text-red-400 text-center font-body">{state.error}</p>
        )}
        <input
          type="text"
          name="name"
          placeholder="Full name"
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          required
          minLength={6}
          className="input-field"
        />
        <input
          type="password"
          name="adminSecret"
          placeholder="Admin access code"
          required
          className="input-field"
        />
        <p className="text-xs text-cream/40 font-body">
          Set <code className="text-cream/60">ADMIN_SETUP_SECRET</code> in your{' '}
          <code className="text-cream/60">.env</code> file and use that value here.
        </p>
        <SubmitButton />
      </form>

      <p className="text-center text-sm text-cream/50 font-body">
        Already have an admin account?{' '}
        <Link href="/admin/login" className="text-electric hover:underline">
          Admin sign in
        </Link>
      </p>
    </div>
  )
}
