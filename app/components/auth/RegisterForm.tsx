'use client'

import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { registerUser, type RegisterState } from '@/app/actions/auth'

const initialState: RegisterState = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-electric text-void rounded-full text-[11px] font-body tracking-[0.18em] uppercase font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? 'Creating account...' : 'Create account'}
    </button>
  )
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerUser, initialState)

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-4xl tracking-wide text-cream">Register</h1>
        <p className="text-sm text-cream/60 font-body">Join Aurum Store</p>
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
          className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/50"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/50"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          required
          minLength={6}
          className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/50"
        />
        <SubmitButton />
      </form>

      <p className="text-center text-sm text-cream/50 font-body">
        Already have an account?{' '}
        <Link href="/login" className="text-cream hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
