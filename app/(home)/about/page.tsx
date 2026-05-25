export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-void pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] tracking-[0.35em] uppercase text-electric mb-3">Aurum</p>
        <h1 className="font-display text-5xl lg:text-6xl text-cream mb-8">About</h1>
        <div className="space-y-6 font-body text-cream/70 leading-relaxed">
          <p>
            AURUM is a luxury fashion house built on restraint — curated collections, editorial
            craft, and pieces designed to outlast seasons.
          </p>
          <p>
            Every garment is selected for material integrity and timeless silhouette. We believe
            luxury is not excess; it is the confidence of knowing exactly what to leave out.
          </p>
          <p className="text-cream/50 text-sm">
            Founded in 2025 · Designed for those who know.
          </p>
        </div>
      </div>
    </main>
  )
}
