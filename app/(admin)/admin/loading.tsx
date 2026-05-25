export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-cream/10 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-cream/5 rounded-xl border border-cream/10" />
        ))}
      </div>
      <div className="h-72 bg-cream/5 rounded-xl border border-cream/10" />
    </div>
  )
}
