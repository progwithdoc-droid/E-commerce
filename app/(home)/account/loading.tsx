export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-void text-cream pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-10 w-48 bg-cream/10 rounded mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          <div className="h-80 rounded-xl bg-cream/5" />
          <div className="space-y-4">
            <div className="h-28 rounded-xl bg-cream/5" />
            <div className="h-28 rounded-xl bg-cream/5" />
            <div className="h-28 rounded-xl bg-cream/5" />
          </div>
        </div>
      </div>
    </div>
  )
}
