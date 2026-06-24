export const UnreadAnnouncementBadge = ({
  className = '',
  count,
}: {
  className?: string
  count: number
}) => {
  if (count <= 0) {
    return null
  }

  return (
    <span
      aria-label={`${count} unread announcement${count === 1 ? '' : 's'}`}
      className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d85b27] px-1.5 text-[10px] font-black leading-none text-white shadow-sm ring-2 ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
