import { useAuth } from '../hooks/useAuth'

export const ProfilePage = () => {
  const { appUser } = useAuth()

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">Profile</h1>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700">
        <div>
          <dt className="font-semibold">Name</dt>
          <dd>{appUser?.displayName ?? '—'}</dd>
        </div>
        <div>
          <dt className="font-semibold">Email</dt>
          <dd>{appUser?.email ?? '—'}</dd>
        </div>
        <div>
          <dt className="font-semibold">Role</dt>
          <dd className="capitalize">{appUser?.role ?? 'contributor'}</dd>
        </div>
      </dl>
    </section>
  )
}
