export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-void pt-20 px-6 lg:px-12 animate-pulse">
      <div className="h-[60vh] rounded-xl bg-cream/5 mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-cream/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded bg-cream/5" />
        ))}
      </div>
    </main>
  )
}
