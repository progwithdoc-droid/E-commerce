'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginUser, type LoginState } from '@/app/actions/auth'

type LoginFormProps = {
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
      {pending ? 'Signing in...' : 'Sign in with email'}
    </button>
  )
}

export function LoginForm({ oauth }: LoginFormProps) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/account'
  const authError = searchParams.get('error')
  const registered = searchParams.get('registered')

  const [state, formAction] = useFormState(loginUser, initialState)
  const error =
    state.error ??
    (authError ? 'Sign in failed. Try again or use another method.' : null)

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-4xl tracking-wide text-cream">Sign In</h1>
        <p className="text-sm text-cream/60 font-body">
          Welcome back to Aurum Store
        </p>
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

          <div className="flex items-center gap-4">
            <span className="flex-1 h-px bg-cream/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-body">
              or
            </span>
            <span className="flex-1 h-px bg-cream/10" />
          </div>
        </>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {registered && !error && (
          <p className="text-sm text-electric text-center font-body">
            Account created. Sign in with your email and password.
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 text-center font-body">{error}</p>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/50"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={6}
          autoComplete="current-password"
          className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/50"
        />
        <SubmitButton />
      </form>

      <p className="text-center text-sm text-cream/50 font-body">
        No account?{' '}
        <Link href="/register" className="text-cream hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
