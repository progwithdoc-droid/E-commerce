'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="border border-red-500/30 rounded-xl p-8 bg-red-500/5 max-w-lg">
      <h2 className="font-display text-2xl text-cream mb-2">Something went wrong</h2>
      <p className="text-sm text-cream/50 font-body mb-6">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-electric text-void rounded-lg text-[10px] uppercase tracking-widest"
      >
        Try again
      </button>
    </div>
  )
}
