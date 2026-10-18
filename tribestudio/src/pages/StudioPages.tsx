import { ChangeEvent, FormEvent, ReactNode, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AchievementBadgeCard } from '../components/AchievementBadgeCard'
import {
  adminAreas,
  analyticsCharts,
  campaigns,
  createTypes,
  reviewQueue,
  roles,
  ContentRecord,
  ContentTier,
} from '../data/studioData'
import { useAuth } from '../contexts/AuthContext'
import { useAchievementProfile } from '../hooks/useAchievementProfile'
import { useStudioContent } from '../hooks/useStudioContent'
import {
  ACHIEVEMENT_ASSET_AUDIT,
  ACHIEVEMENT_CATEGORIES,
  AchievementCategory,
  getFeaturedAchievementStates,
} from '../lib/achievements'
import { firebaseConfigStatus } from '../lib/firebase'
import { studioFeatureFlags } from '../lib/featureFlags'
import { studioService } from '../services/studioService'

type AchievementFilter = 'all' | 'unlocked' | 'locked'
type AchievementCategoryFilter = 'All' | AchievementCategory

const tierClasses: Record<ContentTier, string> = {
  Open: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  Restricted: 'bg-amber-50 text-amber-800 ring-amber-200',
  Sensitive: 'bg-rose-50 text-rose-800 ring-rose-200',
}

function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/65">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

function Panel({
  title,
  children,
  footer,
}: {
  title?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-panel p-5 shadow-sm">
      {title ? <h2 className="font-display text-lg font-semibold">{title}</h2> : null}
      <div className={title ? 'mt-4' : ''}>{children}</div>
      {footer ? <div className="mt-4 border-t border-ink/10 pt-4">{footer}</div> : null}
    </section>
  )
}

function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'danger' }) {
  const classes = {
    neutral: 'bg-surface text-ink/70 ring-ink/10',
    good: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    warn: 'bg-amber-50 text-amber-800 ring-amber-200',
    danger: 'bg-rose-50 text-rose-800 ring-rose-200',
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${classes[tone]}`}>
      {children}
    </span>
  )
}

function TierPill({ tier }: { tier: ContentTier }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tierClasses[tier]}`}>
      {tier}
    </span>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  name: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  type?: string
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
      />
    </label>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-ink/10">
      <div className="h-full rounded-full bg-indigo" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  )
}

function formatNumber(value: number) {
  return value.toLocaleString()
}

export function AuthPage() {
  const {
    error,
    firebaseReady,
    loading,
    profile,
    signInWithGoogle,
    signOut,
    user,
  } = useAuth()
  const [actionError, setActionError] = useState('')

  async function handleGoogleSignIn() {
    setActionError('')

    try {
      await signInWithGoogle()
    } catch (signInError) {
      setActionError(
        signInError instanceof Error
          ? signInError.message
          : 'Google sign-in could not be started.',
      )
    }
  }

  async function handleSignOut() {
    setActionError('')

    try {
      await signOut()
    } catch (signOutError) {
      setActionError(
        signOutError instanceof Error ? signOutError.message : 'Sign-out failed.',
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Firebase Authentication"
        title={user ? `Signed in as ${profile?.displayName ?? user.displayName ?? 'Contributor'}.` : 'Google sign-in for TribeStudio.'}
        description="Google sign-in creates or refreshes the signed-in user's Firestore user and contributor profile documents. Email, phone and anonymous auth stay off for this MVP."
      />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Google access">
          <div className="space-y-3">
            <button
              type="button"
              disabled={!firebaseReady || loading}
              onClick={user ? handleSignOut : handleGoogleSignIn}
              className="w-full rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/25"
            >
              {user ? 'Sign out' : loading ? 'Checking session...' : 'Continue with Google'}
            </button>
            {!firebaseReady ? (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                Add the public Firebase web config to `.env.local` before Google sign-in can run. Missing: {firebaseConfigStatus.missingKeys.join(', ')}.
              </p>
            ) : null}
            {actionError || error ? (
              <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
                {actionError || error}
              </p>
            ) : null}
          </div>
        </Panel>
        <Panel title="Firestore profile">
          {user && profile ? (
            <dl className="grid gap-3 text-sm text-ink/70 md:grid-cols-2">
              <div className="rounded-lg bg-surface p-3">
                <dt className="font-semibold text-ink">UID</dt>
                <dd className="mt-1 break-all">{profile.uid}</dd>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <dt className="font-semibold text-ink">Email</dt>
                <dd className="mt-1 break-all">{profile.email}</dd>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <dt className="font-semibold text-ink">Role</dt>
                <dd className="mt-1">{profile.role}</dd>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <dt className="font-semibold text-ink">Consent</dt>
                <dd className="mt-1">{profile.consentAcknowledged ? 'Acknowledged' : 'Pending'}</dd>
              </div>
            </dl>
          ) : (
            <p className="rounded-lg bg-surface p-4 text-sm text-ink/60">
              Sign in with Google to create or update your Firestore `users` and `profiles` records.
            </p>
          )}
        </Panel>
      </div>
    </div>
  )
}

export function OnboardingPage() {
  const { profile, updateContributorProfile, user } = useAuth()
  const [consent, setConsent] = useState(false)
  const [form, setForm] = useState({
    role: 'contributor',
    community: 'Kasem / Kasena',
    language: 'Kasem',
    expertise: 'Language contributor',
    knowledgeArea: 'Open learning',
    creatorInterest: 'Lessons',
  })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setIsError(false)

    try {
      await updateContributorProfile({
        interests: [form.creatorInterest],
        communities: [form.community],
        languages: [form.language],
        expertise: [form.role, form.expertise, form.knowledgeArea],
        consentAcknowledged: consent,
        privacy: profile?.privacy ?? {
          showDisplayName: true,
          showBadges: true,
        },
      })
      setMessage('Contributor profile saved to Firestore.')
    } catch (profileError) {
      setIsError(true)
      setMessage(
        profileError instanceof Error
          ? profileError.message
          : 'Contributor profile could not be saved.',
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Onboarding"
        title="Profile setup for contributors, creators and validators."
        description="The onboarding flow writes owner-scoped Firestore profile fields: community, languages, expertise, interests, privacy defaults and consent acknowledgement."
      />
      <Panel title="Onboarding form">
        <form onSubmit={submit}>
          <div className="grid gap-4 lg:grid-cols-3">
            <Select label="Role interest" name="role" value={form.role} onChange={update} options={roles} />
            <Select label="Community" name="community" value={form.community} onChange={update} options={['Kasem / Kasena', 'Indigen World contributor']} />
            <Select label="Languages" name="language" value={form.language} onChange={update} options={['Kasem', 'English', 'Other future language']} />
            <Select label="Expertise" name="expertise" value={form.expertise} onChange={update} options={['Language contributor', 'Storyteller', 'Validator training', 'Researcher']} />
            <Select label="Cultural knowledge areas" name="knowledgeArea" value={form.knowledgeArea} onChange={update} options={['Open learning', 'Restricted content review', 'Sensitive escalation']} />
            <Select label="Creator interests" name="creatorInterest" value={form.creatorInterest} onChange={update} options={['Lessons', 'Stories', 'Audio concepts', 'Image collections']} />
          </div>
          <label className="mt-5 flex gap-3 rounded-lg bg-surface p-4 text-sm text-ink/70">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            I acknowledge that cultural content requires consent, attribution and review before publication or AI use.
          </label>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!user}
              className="rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/25"
            >
              Save Firestore profile
            </button>
            {!user ? <Pill tone="warn">Google sign-in required</Pill> : null}
          </div>
          {message ? (
            <p className={`mt-4 rounded-lg p-3 text-sm ${isError ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
              {message}
            </p>
          ) : null}
        </form>
        <div className="mt-5 rounded-lg border border-ink/10 p-4">
          <p className="text-sm font-semibold text-ink">Current profile</p>
          <p className="mt-2 text-sm text-ink/60">
            {profile
              ? `${profile.displayName}, ${profile.communities.join(', ')}, ${profile.languages.join(', ')}.`
              : 'Sign in to load your Firestore contributor profile.'}
          </p>
          <Pill tone={profile?.consentAcknowledged || consent ? 'good' : 'warn'}>
            {profile?.consentAcknowledged || consent ? 'consent acknowledged' : 'consent pending'}
          </Pill>
        </div>
      </Panel>
    </div>
  )
}

export function DashboardPage() {
  const { firebaseReady, profile, user } = useAuth()
  const { error, loading, records } = useStudioContent()
  const draftCount = records.filter((record) => record.status === 'draft').length
  const pendingCount = records.filter((record) => record.status === 'pending review').length
  const approvedCount = records.filter((record) => record.status === 'approved').length
  const restrictedCount = records.filter((record) => record.tier !== 'Open').length
  const latestRecords = records.slice(0, 5)
  const notices = [
    !firebaseReady ? 'Firebase web config is required before live reads can run.' : '',
    firebaseReady && !user ? 'Sign in with Google to load your contributor records.' : '',
    error,
    studioFeatureFlags.aiCalls ? '' : 'AI calls are feature-flagged off for the MVP.',
    studioFeatureFlags.payments ? '' : 'Payments and redemptions are feature-flagged off for the MVP.',
  ].filter((item): item is string => Boolean(item))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Contribution command center."
        description="Signed-in contributors see their own Firestore draft and review-state records. Payments, AI calls and Blaze-only workflows remain off."
        actions={<Pill tone={user ? 'good' : 'warn'}>{user ? 'Firestore synced' : 'Google sign-in required'}</Pill>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Drafts', value: draftCount, note: 'Firestore contributions' },
          { label: 'Pending review', value: pendingCount, note: 'submitted or revision queue' },
          { label: 'Approved', value: approvedCount, note: 'validated records' },
          { label: 'Restricted', value: restrictedCount, note: 'requires elevated review' },
        ].map((stat) => (
          <Panel key={stat.label}>
            <p className="text-sm font-semibold text-ink/60">{stat.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-ink">{loading ? '...' : formatNumber(stat.value)}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">{stat.note}</p>
          </Panel>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Recent activity">
          {latestRecords.length ? (
            <ul className="space-y-3">
              {latestRecords.map((item) => (
                <li key={item.id} className="rounded-lg bg-surface px-3 py-2 text-sm text-ink/70">
                  {item.title} updated as {item.status} on {item.updatedAt}.
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg bg-surface p-4 text-sm text-ink/60">
              {user
                ? 'No Firestore contribution records yet. Save your first draft from Create.'
                : 'Sign in to load your Firestore contribution activity.'}
            </p>
          )}
        </Panel>
        <Panel title="Notifications">
          <ul className="space-y-3">
            {notices.map((item) => (
              <li key={item} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {item}
              </li>
            ))}
            {profile?.consentAcknowledged ? (
              <li className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Contributor consent acknowledgement is saved on your profile.
              </li>
            ) : null}
          </ul>
        </Panel>
      </div>
      <Panel title="Quick actions">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {['New word', 'Review queue', 'Campaigns', 'Analytics'].map((action) => (
            <button key={action} type="button" className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink/75">
              {action}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export function CreatePage() {
  const { firebaseReady, user } = useAuth()
  const [type, setType] = useState(createTypes[0])
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [form, setForm] = useState({
    title: '',
    language: 'Kasem',
    dialect: '',
    source: '',
    consent: false,
    contentTier: 'Open',
    permittedUses: 'Educational community review',
    aiTraining: 'Off',
    commercialUse: 'Off',
  })

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type: inputType } = event.target
    setForm((current) => ({
      ...current,
      [name]: inputType === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setIsError(false)

    try {
      const result = await studioService.saveDraft({
        type,
        title: form.title || 'Untitled contribution draft',
        language: form.language,
        dialect: form.dialect,
        source: form.source,
        consent: form.consent,
        contentTier: form.contentTier,
        permittedUses: form.permittedUses,
      })
      setMessage(`Firestore draft saved: ${result.id}`)
      setForm((current) => ({
        ...current,
        title: '',
        dialect: '',
        source: '',
        consent: false,
      }))
    } catch (saveError) {
      setIsError(true)
      setMessage(
        saveError instanceof Error ? saveError.message : 'Draft could not be saved.',
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create workspace"
        title="Structured drafts for language and cultural content."
        description="Create owner-scoped open drafts in Firestore. Restricted, sensitive, AI-training and commercial-use workflows stay behind feature flags for this MVP."
        actions={<Pill tone={user ? 'good' : 'warn'}>{user ? 'ready to save' : 'sign in required'}</Pill>}
      />
      <Panel title="Draft type">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {createTypes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setType(item)}
              className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold ${
                type === item ? 'border-indigo bg-indigo text-white' : 'border-ink/10 bg-white text-ink/70'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={`${type} draft`}>
        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
          <Field label="Title or source text" name="title" value={form.title} onChange={update} />
          <Field label="Language" name="language" value={form.language} onChange={update} />
          <Field label="Dialect" name="dialect" value={form.dialect} onChange={update} />
          <Field label="Source" name="source" value={form.source} onChange={update} />
          <Select label="Content tier" name="contentTier" value={form.contentTier} onChange={update} options={['Open']} />
          <Field label="Permitted uses" name="permittedUses" value={form.permittedUses} onChange={update} />
          <Select label="AI-training permission" name="aiTraining" value={form.aiTraining} onChange={update} options={['Off']} />
          <Select label="Commercial-use permission" name="commercialUse" value={form.commercialUse} onChange={update} options={['Off']} />
          <label className="flex gap-3 rounded-lg bg-surface p-3 text-sm text-ink/70 lg:col-span-2">
            <input name="consent" type="checkbox" checked={form.consent} onChange={update} />
            Consent acknowledgement recorded for this Firestore draft.
          </label>
          <button
            type="submit"
            disabled={!firebaseReady || !user}
            className="rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/25"
          >
            Save Firestore draft
          </button>
          {message ? (
            <p className={`rounded-lg p-3 text-sm ${isError ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
              {message}
            </p>
          ) : null}
        </form>
      </Panel>
    </div>
  )
}

export function ContentPage() {
  const { user } = useAuth()
  const { error, loading, records } = useStudioContent()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const filtered = records.filter((record) => {
    const matchesQuery = `${record.title} ${record.type} ${record.language} ${record.contributor}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesStatus = status === 'all' || record.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content library"
        title="Your Firestore contribution library."
        description="Search and filter the signed-in contributor's own drafts and submitted records. Broader review/admin libraries remain role-gated."
      />
      {!user ? (
        <Panel>
          <p className="rounded-lg bg-surface p-4 text-sm text-ink/60">
            Sign in with Google to read your Firestore contribution records.
          </p>
        </Panel>
      ) : null}
      {error ? (
        <Panel>
          <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-800">{error}</p>
        </Panel>
      ) : null}
      <Panel>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search content, language or contributor"
            className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm"
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm">
            {['all', 'draft', 'submitted', 'pending review', 'approved', 'rejected', 'restricted', 'sensitive', 'archived'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </Panel>
      {loading ? (
        <Panel>
          <p className="rounded-lg bg-surface p-4 text-sm text-ink/60">Loading Firestore records...</p>
        </Panel>
      ) : (
        <ContentTable records={filtered} />
      )}
    </div>
  )
}

export function LanguagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Language contribution"
        title="Kasem language contribution form."
        description="The UI captures source language, source text, Kasem translation, dialect, region, part of speech, example sentence, source, contributor, consent, licence, validation status, duplicate warning and audio placeholder."
      />
      <Panel title="Language contribution fields">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            'Source language',
            'Source text',
            'Kasem translation',
            'Dialect',
            'Region',
            'Part of speech',
            'Example sentence',
            'Source',
            'Contributor',
            'Consent',
            'Licence',
            'Validation status',
          ].map((field) => (
            <label key={field} className="text-sm font-semibold text-ink">
              {field}
              <input className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm" placeholder={`Demo ${field.toLowerCase()}`} />
            </label>
          ))}
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Duplicate-warning interface">
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Possible duplicate: water - koom. Review dialect, source and example sentence before submission.
          </p>
        </Panel>
        <Panel title="Audio placeholder">
          <div className="flex items-center justify-between gap-4 rounded-lg bg-surface p-4">
            <div>
              <p className="text-sm font-semibold text-ink">Pronunciation audio</p>
              <p className="text-sm text-ink/60">Coming soon. No audio upload service is active.</p>
            </div>
            <Pill>placeholder</Pill>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function ReviewsPage() {
  const [decision, setDecision] = useState('No decision yet')
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Validator workspace"
        title="Review queue with side-by-side content and verification checks."
        description="Validators can approve, reject, request revision, add notes, confirm dialect, verify source and consent, flag sensitivity and inspect review history."
      />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Review queue">
          <ul className="space-y-3">
            {reviewQueue.map((task) => (
              <li key={task.id} className="rounded-lg border border-ink/10 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{task.type}</Pill>
                  <TierPill tier={task.tier} />
                </div>
                <p className="mt-3 font-semibold text-ink">{task.title}</p>
                <p className="text-sm text-ink/60">{task.contributor}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Side-by-side review">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg bg-surface p-4">
              <p className="text-sm font-semibold text-ink">Submitted content</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">{reviewQueue[0].submittedText}</p>
            </div>
            <div className="rounded-lg bg-surface p-4">
              <p className="text-sm font-semibold text-ink">Meaning and notes</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">{reviewQueue[0].comparisonText}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              `Dialect confirmation: ${reviewQueue[0].dialect}`,
              `Source verification: ${reviewQueue[0].sourceVerification}`,
              `Consent verification: ${reviewQueue[0].consentStatus}`,
              `Sensitivity flag: ${reviewQueue[0].sensitivityFlag}`,
            ].map((item) => (
              <p key={item} className="rounded-lg border border-ink/10 px-3 py-2 text-sm text-ink/70">
                {item}
              </p>
            ))}
          </div>
          <label className="mt-4 block text-sm font-semibold text-ink">
            Review notes
            <textarea className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" rows={4} defaultValue="Request source verification before approval." />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Approve', 'Reject', 'Request revision'].map((action) => (
              <button key={action} type="button" onClick={() => setDecision(action)} className="rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white">
                {action}
              </button>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-surface p-3 text-sm text-ink/70">Decision state: {decision}</p>
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">Review history</p>
            <ul className="mt-2 space-y-2">
              {reviewQueue[0].history.map((item) => (
                <li key={item} className="text-sm text-ink/65">{item}</li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Campaigns"
        title="Language campaigns, story drives and bounty placeholders."
        description="Campaigns show progress, deadline, points, eligibility and sponsor badge fields. No real payout is connected."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Panel key={campaign.title} title={campaign.title}>
            <Pill>{campaign.type}</Pill>
            <div className="mt-4">
              <ProgressBar value={campaign.progress} />
              <p className="mt-2 text-sm text-ink/60">{campaign.progress}% demo progress</p>
            </div>
            <dl className="mt-4 space-y-2 text-sm text-ink/70">
              <div><dt className="font-semibold text-ink">Deadline</dt><dd>{campaign.deadline}</dd></div>
              <div><dt className="font-semibold text-ink">Points</dt><dd>{campaign.points}</dd></div>
              <div><dt className="font-semibold text-ink">Eligibility</dt><dd>{campaign.eligibility}</dd></div>
              <div><dt className="font-semibold text-ink">Sponsor badge</dt><dd>{campaign.sponsor}</dd></div>
            </dl>
          </Panel>
        ))}
      </div>
    </div>
  )
}

export function RewardsPage() {
  const { achievementStates, profile, summary } = useAchievementProfile()
  const featuredAchievements = getFeaturedAchievementStates(achievementStates, 6)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Rewards"
        title="Points, ranks, badges and quality signals."
        description="Achievement progress remains browser-local in this MVP. Payouts, redemptions and payment integrations are feature-flagged off."
        actions={<Link to="/achievements" className="rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white">View all achievements</Link>}
      />
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Points', formatNumber(profile.points)],
          ['Rank', profile.rank],
          ['Quality score', `${profile.qualityScore}% browser profile`],
          ['Level', String(profile.level)],
        ].map(([label, value]) => (
          <Panel key={label}>
            <p className="text-sm font-semibold text-ink/60">{label}</p>
            <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Achievement progress</h2>
            <p className="mt-1 text-sm text-ink/60">
              {formatNumber(summary.unlocked)} unlocked across {formatNumber(summary.total)} catalogue badges.
            </p>
          </div>
          <Pill tone={summary.nextLocked ? 'warn' : 'good'}>
            {summary.nextLocked ? `Next: ${summary.nextLocked.title}` : 'catalogue complete'}
          </Pill>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {featuredAchievements.map((state) => (
            <AchievementBadgeCard key={state.id} state={state} compact />
          ))}
        </div>
      </Panel>
      <Panel title="Redemption placeholder">
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          Redemptions are disabled. This MVP has no payout, gift card or payment integration.
        </p>
      </Panel>
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Demo charts for contribution quality and campaign health."
        description="Charts cover contributions, approval rate, rejection reasons, dialect coverage, review turnaround, contributor retention and campaign progress."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {Object.entries(analyticsCharts).map(([key, data]) => (
          <Panel key={key} title={labelize(key)}>
            <div className="space-y-4">
              {data.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-ink">{item.label}</span>
                    <span className="text-ink/55">{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} />
                  <p className="mt-1 text-xs text-ink/45">{item.note}</p>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}

export function AchievementsPage() {
  const { achievementStates, profile, summary } = useAchievementProfile()
  const [filter, setFilter] = useState<AchievementFilter>('all')
  const [category, setCategory] = useState<AchievementCategoryFilter>('All')
  const categoryOptions: AchievementCategoryFilter[] = ['All', ...ACHIEVEMENT_CATEGORIES]
  const filteredAchievements = useMemo(
    () =>
      achievementStates.filter((state) => {
        const matchesFilter =
          filter === 'all' ||
          (filter === 'unlocked' && state.unlocked) ||
          (filter === 'locked' && !state.unlocked)
        const matchesCategory = category === 'All' || state.category === category

        return matchesFilter && matchesCategory
      }),
    [achievementStates, category, filter],
  )
  const missingAssets = ACHIEVEMENT_ASSET_AUDIT.missing

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Achievements"
        title="Achievement catalogue."
        description="Badge progress is evaluated from the browser achievement profile and can move to Firestore reward accounts after that feature is enabled."
        actions={<Link to="/profile#achievements" className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70">Back to profile</Link>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Unlocked', formatNumber(summary.unlocked)],
          ['Locked', formatNumber(summary.locked)],
          ['Regular badges', `${formatNumber(summary.regularUnlocked)} / ${formatNumber(summary.regularTotal)}`],
          ['Hidden unlocked', `${formatNumber(summary.hiddenUnlocked)} / ${formatNumber(summary.hiddenTotal)}`],
        ].map(([label, value]) => (
          <Panel key={label}>
            <p className="text-sm font-semibold text-ink/60">{label}</p>
            <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="flex flex-wrap gap-2">
            {(['all', 'unlocked', 'locked'] as AchievementFilter[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${
                  filter === item ? 'border-indigo bg-indigo text-white' : 'border-ink/10 bg-white text-ink/70'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="text-sm font-semibold text-ink">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as AchievementCategoryFilter)}
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
            >
              {categoryOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </Panel>
      <Panel
        title={`${filteredAchievements.length ? formatNumber(filteredAchievements.length) : 'No'} achievement${filteredAchievements.length === 1 ? '' : 's'}`}
        footer={
          <p className="text-sm text-ink/55">
            Profile source: {profile.displayName}. Saved profile update: {new Date(profile.updatedAt).toLocaleDateString()}.
          </p>
        }
      >
        {filteredAchievements.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAchievements.map((state) => (
              <AchievementBadgeCard key={state.id} state={state} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-surface p-4 text-sm text-ink/60">No achievements match these filters.</p>
        )}
      </Panel>
      <Panel title="Badge asset audit">
        {missingAssets.length ? (
          <div className="space-y-3">
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              {formatNumber(missingAssets.length)} catalogue badge image mapping{missingAssets.length === 1 ? '' : 's'} still need attention.
            </p>
            <ul className="grid gap-2 md:grid-cols-2">
              {missingAssets.map((achievement) => (
                <li key={achievement.id} className="rounded-lg border border-ink/10 bg-white p-3 text-sm text-ink/70">
                  <span className="font-semibold text-ink">{achievement.title}</span>
                  <span className="block text-xs text-ink/50">{achievement.id}.png</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            {formatNumber(ACHIEVEMENT_ASSET_AUDIT.mapped)} of {formatNumber(ACHIEVEMENT_ASSET_AUDIT.total)} catalogue badge images are mapped. No remaining badge images need generation or mapping.
          </p>
        )}
      </Panel>
    </div>
  )
}

export function ProfilePage() {
  const { achievementStates, profile: achievementProfile, summary } = useAchievementProfile()
  const { profile: firestoreProfile, user } = useAuth()
  const featuredAchievements = getFeaturedAchievementStates(achievementStates, 3)
  const displayName = firestoreProfile?.displayName ?? achievementProfile.displayName
  const community = firestoreProfile?.communities.join(', ') || achievementProfile.community
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || achievementProfile.initials

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title={`${displayName} profile.`}
        description="Firestore stores account identity, communities, languages, profile consent and privacy defaults. Achievement metrics remain browser-local for now."
      />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Profile">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-indigo text-sm font-semibold text-white">{initials}</span>
            <div>
              <p className="font-semibold text-ink">{displayName}</p>
              <p className="text-sm text-ink/60">{user ? community : 'Sign in to load Firestore profile details.'}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>{firestoreProfile?.interests[0] ?? 'creator interests'}</Pill>
            <Pill>{firestoreProfile?.privacy.showDisplayName ? 'display name visible' : 'display name private'}</Pill>
            <Pill tone={firestoreProfile?.consentAcknowledged ? 'good' : 'warn'}>
              {firestoreProfile?.consentAcknowledged ? 'consent acknowledged' : 'consent pending'}
            </Pill>
          </div>
        </Panel>
        <Panel title="Progress and saved content">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              `Learning progress ${achievementProfile.learningProgress}%`,
              `Contributions ${formatNumber(achievementProfile.contributionsSubmitted)}`,
              `Saved content ${formatNumber(achievementProfile.savedContent)}`,
            ].map((item) => (
              <p key={item} className="rounded-lg bg-surface p-3 text-sm font-semibold text-ink/70">{item}</p>
            ))}
          </div>
        </Panel>
      </div>
      <Panel>
        <div id="achievements" className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Achievements</h2>
            <p className="mt-1 text-sm text-ink/60">
              {formatNumber(summary.regularUnlocked)} of {formatNumber(summary.regularTotal)} regular badges unlocked.
            </p>
          </div>
          <Link to="/achievements" className="rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white">
            View all achievements
          </Link>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {featuredAchievements.map((state) => (
            <AchievementBadgeCard key={state.id} state={state} compact />
          ))}
        </div>
      </Panel>
    </div>
  )
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace preferences and feature flags."
        description="Contributor profile preferences are live through Firebase Auth and Firestore. Payments, AI calls and Blaze-only services stay off."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {['Email notifications', 'Review reminders', 'Offline draft cache', 'AI calls off', 'Consent renewal prompts', 'Sensitive content warnings'].map((setting) => (
          <Panel key={setting}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-ink">{setting}</p>
              <input type="checkbox" defaultChecked={setting !== 'AI calls off'} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}

export function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Administrative control surfaces."
        description="Admin includes users, roles, communities, languages, content, campaigns, reviews, reports, feature flags, audit logs and system health."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminAreas.map((area) => (
          <Panel key={area}>
            <p className="font-semibold capitalize text-ink">{area}</p>
            <p className="mt-2 text-sm text-ink/60">Elevated admin writes require role-gated Firebase rules.</p>
          </Panel>
        ))}
      </div>
      <Panel title="System health">
        <div className="grid gap-3 md:grid-cols-3">
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Contributor Auth + Firestore MVP wired</p>
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Admin role changes locked behind rules</p>
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">AI and payment providers off</p>
        </div>
      </Panel>
    </div>
  )
}

function Select({
  label,
  options,
  name,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  name?: string
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function ContentTable({ records }: { records: ContentRecord[] }) {
  return (
    <Panel>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/45">
            <tr>
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Tier</th>
              <th className="py-3 pr-4">Consent</th>
              <th className="py-3 pr-4">Validation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="py-3 pr-4">
                  <p className="font-semibold text-ink">{record.title}</p>
                  <p className="text-xs text-ink/50">{record.language} / {record.dialect}</p>
                </td>
                <td className="py-3 pr-4">{record.type}</td>
                <td className="py-3 pr-4"><Pill>{record.status}</Pill></td>
                <td className="py-3 pr-4"><TierPill tier={record.tier} /></td>
                <td className="py-3 pr-4">{record.consent}</td>
                <td className="py-3 pr-4">{record.validation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {records.length === 0 ? <p className="mt-4 rounded-lg bg-surface p-3 text-sm text-ink/60">No matching content records.</p> : null}
    </Panel>
  )
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
}
