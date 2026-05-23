export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-void pt-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto animate-pulse space-y-8">
        <div className="h-12 w-48 bg-cream/10 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-cream/5 rounded" />
          ))}
        </div>
      </div>
    </main>
  )
}
