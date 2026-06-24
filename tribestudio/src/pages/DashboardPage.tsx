// Placeholder dashboard. Real metrics, queues and activity feeds come later.
const CARDS = [
  { label: 'Pending submissions', hint: 'review queue' },
  { label: 'Uploads to verify', hint: 'media' },
  { label: 'Active contributors', hint: 'community' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">
          TribeStudio workspace — starter placeholder.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-ink/10 bg-panel p-5"
          >
            <p className="text-sm font-medium text-ink/70">{card.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-ink/30">
              —
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">
              {card.hint}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
