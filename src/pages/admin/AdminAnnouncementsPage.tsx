import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { AlertMessage } from '../../components/common/AlertMessage'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../hooks/useAuth'
import { toDateLabel } from '../../lib/date'
import { createAnnouncement, listAdminAnnouncements } from '../../lib/firestore'
import type { Announcement } from '../../types'

type AnnouncementForm = {
  title: string
  body: string
  category: string
  actionLabel: string
  actionUrl: string
}

type IconName = 'bell' | 'external' | 'send'

const emptyForm: AnnouncementForm = {
  title: '',
  body: '',
  category: 'General',
  actionLabel: '',
  actionUrl: '',
}

const categoryOptions = ['General', 'Rewards', 'Event', 'Maintenance', 'Urgent']

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
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}

export const AdminAnnouncementsPage = () => {
  const { appUser } = useAuth()
  const [form, setForm] = useState<AnnouncementForm>(emptyForm)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadAnnouncements = async () => {
    const items = await listAdminAnnouncements()
    setAnnouncements(items)
  }

  useEffect(() => {
    let active = true

    listAdminAnnouncements()
      .then((items) => {
        if (active) {
          setAnnouncements(items)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error('Admin announcements load failed:', error)
        if (active) {
          setErrorMessage('Announcements could not be loaded.')
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const updateField =
    (field: keyof AnnouncementForm) =>
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
        | ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')

    const title = form.title.trim()
    const body = form.body.trim()
    const actionLabel = form.actionLabel.trim()
    const actionUrl = form.actionUrl.trim()

    if (!title || !body) {
      setErrorMessage('Title and message are required.')
      return
    }

    if ((actionLabel && !actionUrl) || (!actionLabel && actionUrl)) {
      setErrorMessage('Action label and action URL must be filled together.')
      return
    }

    if (appUser?.role !== 'admin') {
      setErrorMessage('Only admin users can send announcements.')
      return
    }

    setIsSubmitting(true)

    try {
      await createAnnouncement(
        {
          title,
          body,
          category: form.category,
          actionLabel,
          actionUrl,
        },
        {
          id: appUser.uid,
          email: appUser.email,
          name: appUser.displayName || 'Admin user',
        },
      )
      setForm(emptyForm)
      setFeedback('Announcement sent.')
      await loadAnnouncements()
    } catch (error) {
      console.error('Announcement send failed:', error)
      setErrorMessage('Announcement could not be sent.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1200px] space-y-4">
        <header className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-kassena-green">
              <Icon name="bell" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[#13231a] sm:text-3xl">
                Announcements
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Send updates to signed-in TribeStudio contributors.
              </p>
            </div>
          </div>
        </header>

        {feedback ? <AlertMessage type="success" message={feedback} /> : null}
        {errorMessage ? (
          <AlertMessage type="error" message={errorMessage} />
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <form
            className="space-y-4 rounded-lg border border-[#eadcc7] bg-white p-4 shadow-sm"
            onSubmit={handleSubmit}
          >
            <h2 className="text-base font-bold text-[#13231a]">
              Send Announcement
            </h2>
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Title</span>
              <input
                value={form.title}
                onChange={updateField('title')}
                maxLength={120}
                className="w-full rounded-lg border border-kassena-cream px-3 py-2 font-normal outline-none focus:border-kassena-green"
              />
            </label>
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Category</span>
              <select
                value={form.category}
                onChange={updateField('category')}
                className="w-full rounded-lg border border-kassena-cream px-3 py-2 font-normal outline-none focus:border-kassena-green"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Message</span>
              <textarea
                value={form.body}
                onChange={updateField('body')}
                rows={7}
                maxLength={1200}
                className="w-full resize-y rounded-lg border border-kassena-cream px-3 py-2 font-normal leading-6 outline-none focus:border-kassena-green"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-1 text-sm font-semibold text-slate-700">
                <span>Action label</span>
                <input
                  value={form.actionLabel}
                  onChange={updateField('actionLabel')}
                  placeholder="View rewards"
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2 font-normal outline-none focus:border-kassena-green"
                />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-slate-700">
                <span>Action URL</span>
                <input
                  value={form.actionUrl}
                  onChange={updateField('actionUrl')}
                  placeholder="/rewards"
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2 font-normal outline-none focus:border-kassena-green"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-kassena-green px-4 text-sm font-bold text-white transition hover:bg-[#083c24] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="send" className="h-4 w-4" />
              {isSubmitting ? 'Sending...' : 'Send Announcement'}
            </button>
          </form>

          <section className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-sm">
            <h2 className="text-base font-bold text-[#13231a]">
              Sent Announcements
            </h2>
            {isLoading ? (
              <div className="mt-3">
                <LoadingState />
              </div>
            ) : announcements.length ? (
              <div className="mt-3 space-y-3">
                {announcements.map((announcement) => (
                  <article
                    key={announcement.id}
                    className="rounded-lg border border-[#eadcc7] bg-[#fffaf2] p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="min-w-0 truncate text-sm font-bold text-[#13231a]">
                        {announcement.title}
                      </h3>
                      <span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-[#eadcc7]">
                        {announcement.category || 'General'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                      {announcement.body}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                      <span>
                        {announcement.isPublished ? 'Published' : 'Draft'} on{' '}
                        {toDateLabel(
                          announcement.publishedAt ?? announcement.createdAt,
                        )}
                      </span>
                      {announcement.actionUrl ? (
                        <a
                          href={announcement.actionUrl}
                          target={
                            announcement.actionUrl.startsWith('/')
                              ? undefined
                              : '_blank'
                          }
                          rel={
                            announcement.actionUrl.startsWith('/')
                              ? undefined
                              : 'noreferrer'
                          }
                          className="inline-flex items-center gap-1 text-kassena-green"
                        >
                          Action
                          <Icon name="external" className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <EmptyState message="No announcements have been sent yet." />
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  )
}
