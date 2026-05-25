export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-void pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[3/4] bg-cream/5 rounded" />
        <div className="space-y-5">
          <div className="h-4 w-24 bg-cream/10 rounded" />
          <div className="h-12 w-2/3 bg-cream/10 rounded" />
          <div className="h-8 w-24 bg-cream/10 rounded" />
          <div className="h-28 w-full bg-cream/5 rounded" />
          <div className="h-11 w-48 bg-cream/10 rounded" />
        </div>
      </div>
    </main>
  )
}
