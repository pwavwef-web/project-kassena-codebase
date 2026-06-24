import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertMessage } from '../components/common/AlertMessage'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { DIALECT_OPTIONS } from '../lib/constants'
import { getUserDialects, isUserProfileComplete } from '../lib/profile'

const contributionFocusOptions = [
  'Words and phrases',
  'Example sentences',
  'Proverbs and sayings',
  'Stories and poems',
  'Audio and pronunciation',
  'Cultural media',
  'Validation and review',
]

export const CompleteProfilePage = () => {
  const { appUser, isLoading, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const initialDialects = useMemo(() => getUserDialects(appUser), [appUser])
  const [displayName, setDisplayName] = useState(appUser?.displayName ?? '')
  const [community, setCommunity] = useState(appUser?.community ?? '')
  const [dialects, setDialects] = useState<string[]>(initialDialects)
  const [phone, setPhone] = useState(appUser?.phone ?? '')
  const [contributionFocus, setContributionFocus] = useState(
    appUser?.contributionFocus ?? '',
  )
  const [bio, setBio] = useState(appUser?.bio ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  if (isLoading) {
    return <LoadingState message="Loading signup details..." />
  }

  if (!appUser) {
    return <Navigate to="/login" replace />
  }

  if (isUserProfileComplete(appUser)) {
    return <Navigate to="/dashboard" replace />
  }

  const toggleDialect = (dialect: string) => {
    setDialects((current) =>
      current.includes(dialect)
        ? current.filter((item) => item !== dialect)
        : [...current, dialect],
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!displayName.trim() || !community.trim() || !dialects.length) {
      setError('Name, community and at least one dialect are required.')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      await updateUserProfile({
        displayName,
        photoURL: appUser.photoURL,
        community,
        dialect: dialects[0] ?? '',
        dialects,
        phone,
        contributionFocus,
        bio,
      })
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Unable to save signup details right now.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">
        Complete your signup
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        These details help validators understand dialect, community context and
        the kind of knowledge you want to contribute.
      </p>

      {error ? (
        <div className="mt-4">
          <AlertMessage type="error" message={error} />
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Full name *</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-lg border border-kassena-cream px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Community or hometown *</span>
            <input
              value={community}
              onChange={(event) => setCommunity(event.target.value)}
              placeholder="Navrongo, Paga, Chiana..."
              className="w-full rounded-lg border border-kassena-cream px-3 py-2"
            />
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-900">
            Dialects or regions you know *
          </legend>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {DIALECT_OPTIONS.map((dialect) => (
              <label
                key={dialect}
                className="flex items-center gap-2 rounded-lg border border-kassena-cream px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={dialects.includes(dialect)}
                  onChange={() => toggleDialect(dialect)}
                />
                <span>{dialect}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Phone or WhatsApp</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-lg border border-kassena-cream px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Contribution focus</span>
            <select
              value={contributionFocus}
              onChange={(event) => setContributionFocus(event.target.value)}
              className="w-full rounded-lg border border-kassena-cream px-3 py-2"
            >
              <option value="">Select focus</option>
              {contributionFocusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-1 text-sm">
          <span>Relevant background</span>
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Native speaker, teacher, student, elder-sourced contributor, researcher..."
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-kassena-orange px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Finish signup'}
        </button>
      </form>
    </section>
  )
}
