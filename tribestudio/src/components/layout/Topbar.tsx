import { useAuth } from '../../contexts/AuthContext'

export function Topbar() {
  const { firebaseReady, profile, signInWithGoogle, signOut, user } = useAuth()
  const initials = (profile?.displayName ?? user?.displayName ?? user?.email ?? 'TS')
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2)
  const status = user
    ? 'Firestore contributor session'
    : firebaseReady
      ? 'Google sign-in available'
      : 'Firebase config required'

  return (
    <header className="flex min-h-16 flex-col gap-3 border-b border-ink/10 bg-panel px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold text-ink">Workspace</p>
        <p className="text-xs text-ink/45">{status}</p>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-xl">
        <label className="sr-only" htmlFor="workspace-search">
          Search workspace
        </label>
        <input
          id="workspace-search"
          placeholder="Search drafts, reviews, contributors"
          className="min-w-0 flex-1 rounded-lg border border-ink/10 bg-surface px-3 py-2 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
        />
        <button
          type="button"
          disabled={!firebaseReady}
          onClick={user ? signOut : signInWithGoogle}
          className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/35"
        >
          {user ? 'Sign out' : 'Google'}
        </button>
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-full bg-indigo text-xs font-semibold text-white"
        >
          {initials || 'TS'}
        </span>
      </div>
    </header>
  )
}
