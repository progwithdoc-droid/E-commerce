export const dynamic = 'force-dynamic'

const posts = [
  {
    title: 'The Art of Restraint',
    date: 'March 2025',
    excerpt: 'Why SS25 strips back to essential forms, natural fibers, and a monochrome palette.',
  },
  {
    title: 'Material Notes: Italian Wool',
    date: 'February 2025',
    excerpt: 'Inside our sourcing process for double-faced wool coats and structured tailoring.',
  },
  {
    title: 'Studio Visit: SS25 Campaign',
    date: 'January 2025',
    excerpt: 'Behind the scenes of our latest lookbook — light, shadow, and movement.',
  },
]

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-void pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] tracking-[0.35em] uppercase text-electric mb-3">Aurum</p>
        <h1 className="font-display text-5xl lg:text-6xl text-cream mb-12">Journal</h1>
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.title} className="border-b border-cream/10 pb-10">
              <p className="text-[10px] uppercase tracking-widest text-cream/40 mb-2">{post.date}</p>
              <h2 className="font-display text-2xl text-cream mb-3">{post.title}</h2>
              <p className="font-body text-sm text-cream/60 leading-relaxed">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
