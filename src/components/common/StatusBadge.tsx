export const StatusBadge = ({
  status,
}: {
  status: 'pending' | 'approved' | 'rejected'
}) => {
  const statusClass =
    status === 'pending'
      ? 'bg-amber-100 text-amber-800'
      : status === 'approved'
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-rose-100 text-rose-800'

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
    >
      {status}
    </span>
  )
}
