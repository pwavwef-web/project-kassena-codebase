import { useEffect, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { useAnnouncementNotifications } from '../hooks/useAnnouncementNotifications'
import { useAuth } from '../hooks/useAuth'
import { toDateLabel } from '../lib/date'
import type { Announcement } from '../types'

type IconName = 'arrowLeft' | 'bell' | 'external' | 'megaphone'

const categoryStyles: Record<string, string> = {
  Event: 'bg-blue-50 text-blue-700 ring-blue-100',
  General: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Maintenance: 'bg-slate-100 text-slate-700 ring-slate-200',
  Rewards: 'bg-amber-50 text-amber-700 ring-amber-100',
  Urgent: 'bg-rose-50 text-rose-700 ring-rose-100',
}

const Icon = ({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName
  className?: string
}) => {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
  }

  const paths: Record<IconName, ReactNode> = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    bell: (
      <>
        <path d="M15.5 17h4l-1.2-1.5a2.5 2.5 0 0 1-.5-1.5v-3a5.8 5.8 0 0 0-11.6 0v3a2.5 2.5 0 0 1-.5 1.5L4.5 17h4" />
        <path d="M9.7 19a2.7 2.7 0 0 0 4.6 0" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6" />
        <path d="m10 14 10-10" />
        <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
      </>
    ),
    megaphone: (
      <>
        <path d="M4 13h3l9 4V5L7 9H4v4Z" />
        <path d="M7 13v5a2 2 0 0 0 2 2h1" />
        <path d="M18 9a3 3 0 0 1 0 4" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}

const AnnouncementAction = ({ announcement }: { announcement: Announcement }) => {
  if (!announcement.actionLabel || !announcement.actionUrl) {
    return null
  }

  const classes =
    'mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-kassena-green px-4 py-2 text-sm font-bold text-white transition hover:bg-[#083c24]'

  if (announcement.actionUrl.startsWith('/')) {
    return (
      <Link to={announcement.actionUrl} className={classes}>
        {announcement.actionLabel}
      </Link>
    )
  }

  return (
    <a
      href={announcement.actionUrl}
      className={classes}
      target="_blank"
      rel="noreferrer"
    >
      {announcement.actionLabel}
      <Icon name="external" className="h-4 w-4" />
    </a>
  )
}

export const AnnouncementsPage = () => {
  const navigate = useNavigate()
  const { appUser } = useAuth()
  const { announcements, errorMessage, isLoading, markAllRead } =
    useAnnouncementNotifications()

  useEffect(() => {
    if (!isLoading && announcements.length > 0) {
      markAllRead()
    }
  }, [announcements.length, isLoading, markAllRead])

  return (
    <section className="mx-auto max-w-4xl space-y-5 pb-6">
      <header className="rounded-2xl border border-[#eadcc7] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8cbb8] bg-white px-3 text-sm font-bold text-kassena-green transition hover:bg-kassena-cream/60"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
            Back
          </button>
          {appUser?.role === 'admin' ? (
            <Link
              to="/admin/announcements"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-kassena-green px-3 text-sm font-bold text-white"
            >
              <Icon name="megaphone" className="h-4 w-4" />
              Send Announcement
            </Link>
          ) : null}
        </div>
        <div className="mt-5 flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf6e9] text-kassena-green ring-1 ring-[#cfe2c9]">
            <Icon name="bell" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-[#13231a] sm:text-3xl">
              Announcements
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Updates from the TribeStudio team.
            </p>
          </div>
        </div>
      </header>

      {errorMessage ? (
        <p className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <LoadingState message="Loading announcements..." />
      ) : announcements.length ? (
        <div className="space-y-3">
          {announcements.map((announcement) => {
            const category = announcement.category || 'General'
            const categoryClass =
              categoryStyles[category] ?? categoryStyles.General

            return (
              <article
                key={announcement.id}
                className="rounded-2xl border border-[#eadcc7] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${categoryClass}`}
                  >
                    {category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {toDateLabel(announcement.publishedAt)}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#13231a]">
                  {announcement.title}
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                  {announcement.body}
                </p>
                <p className="mt-4 text-xs font-semibold text-slate-500">
                  Sent by {announcement.createdByName || 'TribeStudio Team'}
                </p>
                <AnnouncementAction announcement={announcement} />
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState message="No announcements have been sent yet." />
      )}
    </section>
  )
}
