export const AlertMessage = ({
  type,
  message,
}: {
  type: 'success' | 'error'
  message: string
}) => (
  <p
    className={`rounded-lg p-3 text-sm ${
      type === 'success'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-rose-50 text-rose-700'
    }`}
  >
    {message}
  </p>
)
