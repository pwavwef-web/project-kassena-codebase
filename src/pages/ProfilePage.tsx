import { useEffect, useMemo, useState } from 'react'
import { AlertMessage } from '../components/common/AlertMessage'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { StatusBadge } from '../components/common/StatusBadge'
import { useAuth } from '../hooks/useAuth'
import { DIALECT_OPTIONS } from '../lib/constants'
import { toDateLabel } from '../lib/date'
import { listUserContributions, listUserUploads } from '../lib/firestore'
import { getUserDialects } from '../lib/profile'
import type { AppUser, Contribution, UploadRecord } from '../types'

type ProfileForm = Pick<
  AppUser,
  | 'displayName'
  | 'photoURL'
  | 'community'
  | 'dialect'
  | 'dialects'
  | 'phone'
  | 'bio'
  | 'contributionFocus'
>

const emptyProfileForm: ProfileForm = {
  displayName: '',
  photoURL: '',
  community: '',
  dialect: '',
  dialects: [],
  phone: '',
  bio: '',
  contributionFocus: '',
}

const countByStatus = <T extends { status: string }>(items: T[]) => ({
  total: items.length,
  pending: items.filter((item) => item.status === 'pending').length,
  approved: items.filter((item) => item.status === 'approved').length,
  rejected: items.filter((item) => item.status === 'rejected').length,
})

export const ProfilePage = () => {
  const { appUser, logout, updateUserProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [form, setForm] = useState<ProfileForm>(emptyProfileForm)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [uploads, setUploads] = useState<UploadRecord[]>([])

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      if (!appUser) {
        return
      }

      const [userContributions, userUploads] = await Promise.all([
        listUserContributions(appUser.uid),
        listUserUploads(appUser.uid),
      ])

      if (active) {
        setContributions(userContributions)
        setUploads(userUploads)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [appUser])

  const contributionStats = useMemo(
    () => countByStatus(contributions),
    [contributions],
  )
  const uploadStats = useMemo(() => countByStatus(uploads), [uploads])

  const points = useMemo(
    () =>
      contributions.reduce((total, contribution) => {
        const hasExamples = Boolean(
          contribution.englishExample || contribution.kasemExample,
        )
        return (
          total +
          10 +
          (contribution.status === 'approved' ? 40 : 0) +
          (hasExamples ? 10 : 0)
        )
      }, 0) +
      uploads.reduce(
        (total, upload) => total + (upload.status === 'approved' ? 100 : 10),
        0,
      ),
    [contributions, uploads],
  )

  if (!appUser) {
    return <LoadingState message="Loading profile..." />
  }

  const initials =
    appUser.displayName
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PK'
  const userDialects = getUserDialects(appUser)

  const toggleDialect = (dialect: string) => {
    setForm((current) => {
      const currentDialects = current.dialects ?? []
      const nextDialects = currentDialects.includes(dialect)
        ? currentDialects.filter((item) => item !== dialect)
        : [...currentDialects, dialect]

      return {
        ...current,
        dialect: nextDialects[0] ?? '',
        dialects: nextDialects,
      }
    })
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      await updateUserProfile(form)
      setFeedback({ type: 'success', message: 'Profile updated.' })
      setIsEditing(false)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Unable to update profile right now.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {appUser.photoURL ? (
              <img
                src={appUser.photoURL}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kassena-green text-xl font-bold text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-kassena-orange">
                {appUser.role}
              </p>
              <h1 className="truncate text-2xl font-bold text-kassena-green">
                {appUser.displayName}
              </h1>
              <p className="truncate text-sm text-slate-600">{appUser.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFeedback(null)
              if (!isEditing) {
                setForm({
                  displayName: appUser.displayName ?? '',
                  photoURL: appUser.photoURL ?? '',
                  community: appUser.community ?? '',
                  dialect: getUserDialects(appUser)[0] ?? '',
                  dialects: getUserDialects(appUser),
                  phone: appUser.phone ?? '',
                  bio: appUser.bio ?? '',
                  contributionFocus: appUser.contributionFocus ?? '',
                })
              }
              setIsEditing((current) => !current)
            }}
            className="rounded-lg border border-kassena-gold px-4 py-2 text-sm font-semibold text-kassena-green"
          >
            {isEditing ? 'Cancel edit' : 'Edit profile'}
          </button>
        </div>

        {feedback ? (
          <div className="mt-4">
            <AlertMessage type={feedback.type} message={feedback.message} />
          </div>
        ) : null}

        {isEditing ? (
          <form className="mt-6 space-y-4" onSubmit={handleSave}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span>Name</span>
                <input
                  value={form.displayName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      displayName: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Photo URL</span>
                <input
                  value={form.photoURL}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      photoURL: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span>Community</span>
                <input
                  value={form.community}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      community: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
            </div>
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-900">
                Dialects or regions you know
              </legend>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {DIALECT_OPTIONS.map((dialect) => (
                  <label
                    key={dialect}
                    className="flex items-center gap-2 rounded-lg border border-kassena-cream px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={(form.dialects ?? []).includes(dialect)}
                      onChange={() => toggleDialect(dialect)}
                    />
                    <span>{dialect}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="space-y-1 text-sm">
              <span>Contribution focus</span>
              <input
                value={form.contributionFocus}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contributionFocus: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-kassena-cream px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Bio or contribution notes</span>
              <textarea
                value={form.bio}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, bio: event.target.value }))
                }
                className="w-full rounded-lg border border-kassena-cream px-3 py-2"
              />
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-kassena-orange px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        ) : (
          <dl className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Community</dt>
              <dd>{appUser.community || 'Not set'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Dialects/regions</dt>
              <dd>
                {userDialects.length ? userDialects.join(', ') : 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Phone</dt>
              <dd>{appUser.phone || 'Not set'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">
                Contribution focus
              </dt>
              <dd>{appUser.contributionFocus || 'Not set'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Last sign-in</dt>
              <dd>{toDateLabel(appUser.lastLoginAt)}</dd>
            </div>
            {appUser.bio ? (
              <div className="md:col-span-2">
                <dt className="font-semibold text-slate-900">Bio</dt>
                <dd>{appUser.bio}</dd>
              </div>
            ) : null}
          </dl>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['Submitted', contributionStats.total],
          ['Pending', contributionStats.pending],
          ['Approved', contributionStats.approved],
          ['Rejected', contributionStats.rejected],
          ['Points', points],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-kassena-green">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-kassena-green">
            Contribution status
          </h2>
          {isLoading ? (
            <div className="mt-4">
              <LoadingState />
            </div>
          ) : contributions.length ? (
            <div className="mt-4 space-y-3">
              {contributions.slice(0, 5).map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-kassena-cream p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-kassena-green">
                      {item.englishText} / {item.kasemText}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.category} - {toDateLabel(item.createdAt)}
                  </p>
                  {item.alternateKasemTerms ? (
                    <p className="mt-2 text-sm text-slate-600">
                      Other Kasem forms: {item.alternateKasemTerms}
                    </p>
                  ) : null}
                  {item.reviewNotes ? (
                    <p className="mt-2 text-sm text-slate-600">
                      {item.reviewNotes}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState message="You have not submitted a language contribution yet." />
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-kassena-green">
              Upload status
            </h2>
            <p className="text-sm text-slate-500">
              {uploadStats.approved}/{uploadStats.total} approved
            </p>
          </div>
          {isLoading ? (
            <div className="mt-4">
              <LoadingState />
            </div>
          ) : uploads.length ? (
            <div className="mt-4 space-y-3">
              {uploads.slice(0, 5).map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-kassena-cream p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-kassena-green">
                      {item.title}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {[
                      item.category,
                      item.consentStatus,
                      item.culturalSensitivity,
                    ]
                      .filter(Boolean)
                      .join(' - ')}
                  </p>
                  {item.reviewNotes ? (
                    <p className="mt-2 text-sm text-slate-600">
                      {item.reviewNotes}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState message="You have not uploaded media or documents yet." />
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-kassena-green">
          Account access
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Contributions and uploaded media stay linked to this profile after
          sign-out.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 rounded-lg bg-kassena-green px-4 py-2 font-semibold text-white"
        >
          Logout
        </button>
      </section>
    </section>
  )
}
