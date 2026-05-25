'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginUser, type LoginState } from '@/app/actions/auth'

type AdminLoginFormProps = {
  oauth: { google: boolean; github: boolean }
}

const initialState: LoginState = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-electric text-void rounded-full text-[11px] font-body tracking-[0.18em] uppercase font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? 'Signing in...' : 'Admin sign in'}
    </button>
  )
}

export function AdminLoginForm({ oauth }: AdminLoginFormProps) {
  const searchParams = useSearchParams()
  const callbackUrl = '/admin'
  const authError = searchParams.get('error')
  const registered = searchParams.get('registered')

  const [state, formAction] = useFormState(loginUser, initialState)
  const error =
    state.error ??
    (authError === 'not_admin'
      ? 'You are signed in, but this account is not an admin.'
      : authError
        ? 'Sign in failed. Try again or use another method.'
        : null)

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-electric">Aurum</p>
        <h1 className="font-display text-4xl tracking-wide text-cream">Admin Login</h1>
        <p className="text-sm text-cream/60 font-body">Sign in to the admin dashboard</p>
      </div>

      {(oauth.google || oauth.github) && (
        <>
          <div className="flex flex-col gap-3">
            {oauth.google && (
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl })}
                className="w-full py-3 border border-cream/20 rounded-full text-[11px] font-body tracking-[0.18em] uppercase text-cream/80 hover:border-cream/50 hover:text-cream transition-all"
              >
                Continue with Google
              </button>
            )}
            {oauth.github && (
              <button
                type="button"
                onClick={() => signIn('github', { callbackUrl })}
                className="w-full py-3 border border-cream/20 rounded-full text-[11px] font-body tracking-[0.18em] uppercase text-cream/80 hover:border-cream/50 hover:text-cream transition-all"
              >
                Continue with GitHub
              </button>
            )}
          </div>
          <p className="text-xs text-cream/40 text-center font-body">
            OAuth accounts must have the ADMIN role set in the database.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex-1 h-px bg-cream/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-body">or</span>
            <span className="flex-1 h-px bg-cream/10" />
          </div>
        </>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {registered && !error && (
          <p className="text-sm text-electric text-center font-body">
            Admin account created. Sign in below.
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 text-center font-body">{error}</p>
        )}
        <input
          type="email"
          name="email"
          placeholder="Admin email"
          required
          autoComplete="email"
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={6}
          autoComplete="current-password"
          className="input-field"
        />
        <SubmitButton />
      </form>

      <p className="text-center text-sm text-cream/50 font-body">
        Need an admin account?{' '}
        <Link href="/admin/register" className="text-electric hover:underline">
          Admin sign up
        </Link>
      </p>
      <p className="text-center text-xs text-cream/40 font-body">
        <Link href="/login" className="hover:text-cream">
          Customer sign in
        </Link>
        {' · '}
        <Link href="/" className="hover:text-cream">
          Back to store
        </Link>
      </p>
    </div>
  )
}
