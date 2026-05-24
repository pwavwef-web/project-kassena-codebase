import { DATA_COLLECTION_TARGET } from '../../lib/constants'

export const DataCollectionProgress = ({
  approved,
  pending,
}: {
  approved: number
  pending: number
}) => {
  const percentage = Math.min(100, (approved / DATA_COLLECTION_TARGET) * 100)

  return (
    <section className="space-y-3 rounded-2xl border border-kassena-gold/40 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-kassena-green">
        Data Collection Progress
      </h3>
      <div className="space-y-1 text-sm text-slate-700">
        <p>Target entries: {DATA_COLLECTION_TARGET.toLocaleString()}</p>
        <p>Approved entries: {approved.toLocaleString()}</p>
        <p>Pending entries: {pending.toLocaleString()}</p>
        <p>Completion: {percentage.toFixed(2)}%</p>
      </div>
      <div className="h-3 rounded-full bg-kassena-cream">
        <div
          className="h-full rounded-full bg-kassena-orange"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  )
}
