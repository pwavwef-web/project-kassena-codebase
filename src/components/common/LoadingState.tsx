export const LoadingState = ({
  message = 'Loading…',
}: {
  message?: string
}) => (
  <div className="rounded-xl border border-kassena-cream bg-white p-4 text-sm text-kassena-green">
    {message}
  </div>
)
